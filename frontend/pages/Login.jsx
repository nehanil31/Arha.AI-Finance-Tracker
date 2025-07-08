import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import API from "../src/api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
      navigate("/login");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p className="register-text">
          New user? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
