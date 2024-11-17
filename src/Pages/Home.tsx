import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import "../Pages/Home.css";
import SkeletonCard from "../Components/SkeletonCard";
import SkeletonTable from "../Components/SkeletonTable";

const HomePage: React.FC = () => {
  interface Attendance {
    id: number;
    volunteer_name: string;
    volunteer_team: string;
    check_in: string;
    check_out: string | null;
  }

  interface Team {
    title: string;
    present: number;
    total: number;
    percentage: number;
  }

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(
          `${API_BASE_URL}/attendances/by-date/${today}`
        );
        setAttendances(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch attendances");
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        setTeamsLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(
          `${API_BASE_URL}/team-attendance/${today}`
        );
        const data = response.data;
        const filteredData = Object.keys(data)
          .filter((key) => key !== "N/A" && key !== "NaN")
          .map((key) => ({
            title: key,
            present: data[key].present,
            total: data[key].total,
            percentage: data[key].percentage,
          }));
        setTeams(filteredData);
      } catch (error) {
        console.error(error);
        setErrorMessage("Server Error");
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchAttendances();
    fetchTeams();
  }, []);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="container">
      <aside></aside>
      <main>
        <h1>CBF Attendance</h1>
        <div className="teams">
          {teamsLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            teams.map((team, index) => (
              <div
                key={index}
                className={`team ${team.title.toLowerCase().replace(" ", "-")}`}
              >
                <span
                  className={`material-icons-sharp ${team.title
                    .toLowerCase()
                    .replace(" ", "-")}-icon`}
                >
                  {getIcon(team.title)}
                </span>
                <h3>{team.title}</h3>
                <h2>
                  {team.present}/{team.total}
                </h2>
                <div className="progress">
                  <svg aria-label={`Progress for ${team.title}`}>
                    <circle
                      cx="38"
                      cy="38"
                      r="36"
                      style={{
                        strokeDasharray: "226",
                        strokeDashoffset: 226 - (team.percentage / 100) * 226,
                      }}
                    ></circle>
                  </svg>
                  <div className="number">
                    <p>{Math.round(team.percentage)}%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="timetable" id="timetable">
          <div>
            <h2>Today's Attendance</h2>
          </div>
          {loading ? (
            <SkeletonTable />
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Volunteer Name</th>
                  <th>Volunteer Team</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => (
                  <tr key={attendance.id}>
                    <td>{attendance.volunteer_name}</td>
                    <td>{attendance.volunteer_team}</td>
                    <td>{formatTime(attendance.check_in)}</td>
                    <td>
                      {attendance.check_out
                        ? formatTime(attendance.check_out)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const getIcon = (title: string) => {
  switch (title) {
    case "Core Team":
      return "architecture";
    case "Event Facilitator":
      return "festival";
    case "Operation":
      return "computer";
    case "Procurement":
      return "dns";
    case "Sales":
      return "point_of_sale";
    case "Public Relations":
      return "public";
    default:
      return "help_outline";
  }
};

export default HomePage;
