import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./Components/Home";
import QRScanner from "./Components/QRScanner";
import { ThemeProvider } from "./ThemeContext";
import "./App.css";
import Volunteer from "./Components/Volunteer";
import AttendanceDashboard from "./Components/AttendanceDashboard";

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
