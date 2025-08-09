import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in by checking localStorage
  const userInfo = localStorage.getItem("userInfo");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>Arha Finance</span>
      </div>

      {/* Only show links if user is logged in */}
      {userInfo && (
        <ul className="navbar-links">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === "/expense" ? "active" : ""}>
            <Link to="/expense">Expenses</Link>
          </li>
          <li className={location.pathname === "/income" ? "active" : ""}>
            <Link to="/income">Income</Link>
          </li>
          <li className={location.pathname === "/report" ? "active" : ""}>
            <Link to="/report">Reports</Link>
          </li>
          {/* <li className={location.pathname === "/settings" ? "active" : ""}>
            <Link to="/settings">Settings</Link>
          </li> */}
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
