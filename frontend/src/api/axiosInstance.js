// src/api/axiosInstance.js
import axios from "axios";

const API = axios.create({
  baseURL: "/api", // Your backend base URL
});

// Attach token from localStorage automatically
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;
