import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Arha AI</h1>
      <p className="home-description">
        Arha AI is a Finance Tracker that helps you manage your personal
        expenses and income with ease.
      </p>
      <ul className="features-list">
        <li>📊 Track your daily transactions</li>
        <li>🧾 Categorize your expenses</li>
        <li>📅 View your monthly financial summary</li>
        <li>🔐 Secure login and account management</li>
      </ul>
      <Link to="/login">
        <button className="login-button">Login / Register</button>
      </Link>
    </div>
  );
};

export default Home;
