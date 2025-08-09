import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Income.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import API from "../src/api/axiosInstance"; // Axios instance with JWT token

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
  });

  // ✅ Fetch incomes from backend
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const { data } = await API.get("/incomes");
        setIncomes(data);
      } catch (err) {
        console.error("Failed to fetch incomes:", err);
        alert("Error loading incomes. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchIncomes();
  }, []);

  // ✅ Add new income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    const { name, amount } = newIncome;
    if (!name || !amount) return;

    try {
      const { data } = await API.post("/incomes", {
        name,
        amount: Number(amount),
      });
      setIncomes([...incomes, data]); // Update state
      setNewIncome({ name: "", amount: "" });
    } catch (err) {
      console.error("Failed to add income:", err);
      alert("Error adding income");
    }
  };

  // ✅ Delete income
  const handleDeleteIncome = async (id) => {
    try {
      await API.delete(`/incomes/${id}`);
      setIncomes(incomes.filter((income) => income._id !== id));
    } catch (err) {
      console.error("Failed to delete income:", err);
      alert("Error deleting income");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      {/* <Sidebar /> */}
      <main className="dashboard-container">
        <h1>Income</h1>

        {/* Chart Section */}
        <div className="section chart-section">
          <h2>Incomes by Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Add Income Form */}
        <div className="section add-income-section">
          <h2>Add New Income</h2>
          <form className="income-form" onSubmit={handleAddIncome}>
            <input
              type="text"
              placeholder="Income Source"
              value={newIncome.name}
              onChange={(e) =>
                setNewIncome({ ...newIncome, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: e.target.value })
              }
              required
            />
            <button type="submit" className="add-btn">
              + Add Income
            </button>
          </form>
        </div>

        {/* Income List */}
        <div className="section income-list-section">
          <h2>All Incomes</h2>
          {incomes.length === 0 ? (
            <p>No incomes found.</p>
          ) : (
            <ul className="income-list">
              {incomes.map((income) => (
                <li key={income._id} className="income-item">
                  <span>
                    💰 <strong>{income.name}</strong> + ₹{income.amount}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteIncome(income._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default IncomePage;
