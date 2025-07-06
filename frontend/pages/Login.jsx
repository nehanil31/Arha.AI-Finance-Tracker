import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { data, Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/users/login", {
        email,
        password,
      });
      console.log(data);
      alert("successfully logged in");
      localStorage.setItem("user", JSON.stringify({ ...data, password: "" }));
      navigate("/dashboard");
    } catch (error) {
      alert("Not logged in");
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
