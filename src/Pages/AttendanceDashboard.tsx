import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../api/config";
import "../Pages/AttendanceDashboard.css";
import SkeletonTable from "../Components/SkeletonTable";

interface Meal {
  breakfast: boolean;
  breakfast_time: string | null;
  lunch: boolean;
  lunch_time: string | null;
  dinner: boolean;
  dinner_time: string | null;
}

interface Attendance {
  id: number;
  volunteer_id: string;
  volunteer_name: string;
  volunteer_team: string;
  check_in: string;
  check_out: string | null;
  note: string | null;
  button_show_note: boolean;
  meal: Meal | null;
}

const AttendanceDashboard: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      if (!selectedDate) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/attendances/by-date/${
            selectedDate.toISOString().split("T")[0]
          }`
        );
        const sortedData = response.data.sort(
          (a: Attendance, b: Attendance) => {
            return (
              new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
            );
          }
        );
        setAttendances(sortedData);
        setErrorMessage(null); // Clear any previous error message
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setErrorMessage("No attendances found for the selected date.");
          setAttendances([]); // Clear previous data
        } else {
          console.error("Error fetching attendances:", error);
          setErrorMessage("An error occurred while fetching attendances.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [selectedDate]);

  const handleRowClick = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      // timeZone: "Asia/Phnom_Penh", // Cambodia time zone
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const renderMealCircles = (meal: Meal | null, volunteerName: string) => {
    const circleStyle = (color: string): React.CSSProperties => ({
      display: "inline-block",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: color,
      margin: "0 2px",
      position: "relative",
    });

    const labelStyle: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold",
    };

    const getColor = (mealStatus: boolean) => (mealStatus ? "green" : "red");

    const formatTime = (timeString: string | null) => {
      if (!timeString) return null;
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        // timeZone: "Asia/Phnom_Penh", // Cambodia time zone
      };
      return new Date(timeString).toLocaleTimeString("en-US", options);
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="tooltip"
          style={circleStyle(getColor(meal?.breakfast ?? false))}
        >
          <span style={labelStyle}>B</span>
          <span className="tooltiptext">
            {meal?.breakfast
              ? `${volunteerName} had Breakfast at ${formatTime(
                  meal.breakfast_time
                )}`
              : `${volunteerName} did not have Breakfast`}
          </span>
        </div>
        <div
          className="tooltip"
          style={circleStyle(getColor(meal?.lunch ?? false))}
        >
          <span style={labelStyle}>L</span>
          <span className="tooltiptext">
            {meal?.lunch
              ? `${volunteerName} had Lunch at ${formatTime(meal.lunch_time)}`
              : `${volunteerName} did not have Lunch`}
          </span>
        </div>
        <div
          className="tooltip"
          style={circleStyle(getColor(meal?.dinner ?? false))}
        >
          <span style={labelStyle}>D</span>
          <span className="tooltiptext">
            {meal?.dinner
              ? `${volunteerName} had Dinner at ${formatTime(meal.dinner_time)}`
              : `${volunteerName} did not have Dinner`}
          </span>
        </div>
      </div>
    );
  };  

  const renderNoteIcon = (note: string | null) => {
    if (!note) return null;
    return (
      <div className="tooltip">
        <i className="fas fa-question-circle"></i>
        <span className="tooltiptext">{note}</span>
      </div>
    );
  };

  return (
    <div className="attendance-table">
      <div className="attendance-header">
        <h2 className="attendance-text">Attendance List</h2>
        <div className="date-picker">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
          <button onClick={() => setSelectedDate(new Date())}>Today</button>
        </div>
      </div>
      {loading ? (
        <SkeletonTable />
      ) : errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Volunteer ID</th>
                <th>Volunteer Name</th>
                <th>Volunteer Team</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Meal</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((attendance) => (
                <tr
                  key={attendance.id}
                  onClick={() => handleRowClick(attendance)}
                >
                  <td>{attendance.volunteer_id}</td>
                  <td>{attendance.volunteer_name}</td>
                  <td>{attendance.volunteer_team}</td>
                  <td>{formatDate(attendance.check_in)}</td>
                  <td>{formatDate(attendance.check_out)}</td>
                  <td>
                    {renderMealCircles(
                      attendance.meal,
                      attendance.volunteer_name
                    )}
                  </td>
                  <td>{renderNoteIcon(attendance.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedAttendance && (
            <div className="attendance-details">
              <h3>Attendance Details</h3>
              <p>
                <strong>Volunteer ID:</strong> {selectedAttendance.volunteer_id}
              </p>
              <p>
                <strong>Volunteer Name:</strong>{" "}
                {selectedAttendance.volunteer_name}
              </p>
              <p>
                <strong>Volunteer Team:</strong>{" "}
                {selectedAttendance.volunteer_team}
              </p>
              <p>
                <strong>Check In:</strong>{" "}
                {formatDate(selectedAttendance.check_in)}
              </p>
              <p>
                <strong>Check Out:</strong>{" "}
                {formatDate(selectedAttendance.check_out)}
              </p>
              <p>
                <strong>Note:</strong> {selectedAttendance.note}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceDashboard;
