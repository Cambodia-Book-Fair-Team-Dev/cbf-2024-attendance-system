import axios from "axios";
import { API_BASE_URL } from "./config"; // Adjust the path as needed

export const fetchVolunteers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volunteers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    throw error;
  }
};