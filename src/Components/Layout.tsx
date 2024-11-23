// src/Components/Layout.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Pages/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      {children}
    </>
  );
};

export default Layout;