import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import the external CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-heading">Welcome to Arha AI</h1>
      <p className="home-description">
        Arha AI is a Finance Tracker that helps you manage your personal
        expenses and income with ease.
        <br />
        📊 Track your daily transactions
        <br />
        🧾 Categorize your expenses
        <br />
        📅 View your monthly financial summary
        <br />
        🔐 Secure login and account management
      </p>

      <Link to="/login">
        <button className="home-button">Login / Register</button>
      </Link>
    </div>
  );
};

export default Home;
