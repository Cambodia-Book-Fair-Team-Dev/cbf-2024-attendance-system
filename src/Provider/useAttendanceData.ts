// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../api/config";

// interface Meal {
//   breakfast: boolean;
//   breakfast_time: string | null;
//   lunch: boolean;
//   lunch_time: string | null;
//   dinner: boolean;
//   dinner_time: string | null;
// }

// interface Attendance {
//   id: number;
//   volunteer_id: string;
//   volunteer_name: string;
//   volunteer_team: string;
//   check_in: string;
//   check_out: string | null;
//   note: string | null;
//   button_show_note: boolean;
//   meal: Meal | null;
// }

// const useAttendanceData = (date: Date | null) => {
//   const [attendances, setAttendances] = useState<Attendance[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//   useEffect(() => {
//     const fetchAttendances = async () => {
//       if (!date) return;
//       try {
//         await delay(5000); // Simulate a 2-second delay
//         const response = await axios.get(
//           `${API_BASE_URL}/attendances/by-date/${date.toISOString().split("T")[0]}`
//         );
//         const sortedData = response.data.sort(
//           (a: Attendance, b: Attendance) => {
//             return new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
//           }
//         );
//         setAttendances(sortedData);
//         setErrorMessage(null); // Clear any previous error message
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response?.status === 404) {
//           setErrorMessage("No attendances found for the selected date.");
//           setAttendances([]); // Clear previous data
//         } else {
//           console.error("Error fetching attendances:", error);
//           setErrorMessage("An error occurred while fetching attendances.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendances();
//   }, [date]);

//   return { attendances, loading, errorMessage };
// };

// export default useAttendanceData;