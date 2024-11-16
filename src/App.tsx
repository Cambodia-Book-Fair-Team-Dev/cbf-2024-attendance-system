import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import QRScanner from "./Components/QRScanner";
import "./App.css"; // Ensure this import is present

function App() {
  return (
    <Router>
      <Header />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan" element={<QRScanner />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
