// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from "./Pages/Header";
// import Dashboard from "./Pages/Home";
// import QRScanner from "./Pages/QRScanner";
// import { ThemeProvider } from "./ThemeContext";
// import "./App.css";
// import Volunteer from "./Pages/Volunteer";
// import AttendanceDashboard from "./Pages/AttendanceDashboard";
// import SelfCheckin from "./Pages/selfcheckin";
// import Login from "./Pages/login";
// import VolunteerDetails from "./Pages/VolunteerDetails";

// function App() {
//   return (
//     <ThemeProvider>
//       <Router
//         future={{
//           v7_relativeSplatPath: true,
//           v7_startTransition: true,
//         }}
//       >
//         <Header />
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/scan" element={<QRScanner />} />
//           <Route path="/volunteer" element={<Volunteer />} />
//           <Route path="/dashboard" element={<AttendanceDashboard />} />
//           <Route path="/selfcheckin" element={<SelfCheckin />} />
//           <Route path="/login" element={<Login />} />
          // <Route path="/volunteer/:id" element={<VolunteerDetails />} />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from "./Pages/Header";
import Dashboard from "./Pages/Home";
import QRScanner from "./Pages/QRScanner";
import { ThemeProvider } from "./ThemeContext";
import "./App.css";
import Volunteer from "./Pages/Volunteer";
import AttendanceDashboard from "./Pages/AttendanceDashboard";
import SelfCheckin from "./Pages/selfcheckin";
import Login from "./Pages/login";
import PrivateRoute from "./Components/PrivateRoute";
import Layout from "./Components/Layout";
import VolunteerDetails from "./Pages/VolunteerDetails";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <PrivateRoute>
                  <QRScanner />
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer"
              element={
                <PrivateRoute>
                  <Volunteer />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AttendanceDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/selfcheckin"
              element={
                <PrivateRoute>
                  <SelfCheckin />
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer/:id"
              element={
                <PrivateRoute>
                  <VolunteerDetails />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;