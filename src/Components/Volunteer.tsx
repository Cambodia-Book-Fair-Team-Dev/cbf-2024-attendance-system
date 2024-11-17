import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Components/Volunteer.css";
import { API_BASE_URL } from "../api/config";
interface Volunteer {
  id: string;
  team: string;
  name: string;
}

const Volunteer: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/volunteers`);
        setVolunteers(response.data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleRowClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  return (
    <div className="volunteer-table">
      <h2>Volunteers List</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} onClick={() => handleRowClick(volunteer)}>
                  <td>{volunteer.id}</td>
                  <td>{volunteer.name}</td>
                  <td>{volunteer.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedVolunteer && (
            <div className="volunteer-details">
              <h3>Volunteer Details</h3>
              <p><strong>ID:</strong> {selectedVolunteer.id}</p>
              <p><strong>Name:</strong> {selectedVolunteer.name}</p>
              <p><strong>Team:</strong> {selectedVolunteer.team}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Volunteer;