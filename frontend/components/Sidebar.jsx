import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">FinanceApp</h2>
      <ul className="sidebar-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={location.pathname === "/expenses" ? "active" : ""}>
          <Link to="/expense">Expenses</Link>
        </li>
        <li className={location.pathname === "/income" ? "active" : ""}>
          <Link to="/income">Income</Link>
        </li>
        <li>
          <Link to="/report">Reports</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
