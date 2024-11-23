import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem("authToken"); // Replace with your auth logic

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
