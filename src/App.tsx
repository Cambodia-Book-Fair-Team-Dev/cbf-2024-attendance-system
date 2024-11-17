import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Pages/Header";
import Dashboard from "./Pages/Home";
import QRScanner from "./Pages/QRScanner";
import { ThemeProvider } from "./ThemeContext";
import "./App.css";
import Volunteer from "./Pages/Volunteer";
import AttendanceDashboard from "./Pages/AttendanceDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/dashboard" element={<AttendanceDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
