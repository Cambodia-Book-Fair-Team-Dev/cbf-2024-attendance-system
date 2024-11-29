import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Pages/Volunteer.css";
import { API_BASE_URL } from "../api/config";
import SkeletonTable from "../Components/SkeletonTable";

interface Volunteer {
  id: string;
  team: string;
  name: string;
  kh_name: string;
}

const Volunteer: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/volunteers`);
        // Sort volunteers by id (ascending)
        const sortedVolunteers = response.data.sort(
          (a: Volunteer, b: Volunteer) => a.id.localeCompare(b.id)
        );
        setVolunteers(sortedVolunteers);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // const handleRowClick = (volunteerId: string) => {
  //   navigate(`/volunteer/${volunteerId}`);
  // };

  const handleRowClick = (volunteerId: string) => {
    const encodedId = btoa(volunteerId);
    navigate(`/volunteer/${encodedId}`);
  };
  
  return (
    <div className="volunteer-table">
      <h2>Volunteers List</h2>
      {loading ? (
        <SkeletonTable />
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Khmer Name</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr
                key={volunteer.id}
                onClick={() => handleRowClick(volunteer.id)}
              >
                <td>{volunteer.id}</td>
                <td>{volunteer.name}</td>
                <td>{volunteer.kh_name}</td>
                <td>{volunteer.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Volunteer;
