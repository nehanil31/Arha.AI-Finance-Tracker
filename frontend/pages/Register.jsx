import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate(); // ✅ Move inside the component

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call here
    console.log({ name, password, email });
    try {
      await axios.post("/api/v1/users/register", {
        name,
        email,
        password,
      });
      alert("Registered successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Registration unsuccessfull");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Register</button>

        <p className="login-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
