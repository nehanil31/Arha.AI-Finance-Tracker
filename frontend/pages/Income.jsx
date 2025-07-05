import React, { useState } from "react";
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

const IncomePage = () => {
  const [incomes, setIncomes] = useState([
    { id: 1, name: "Salary", amount: 50000 },
    { id: 2, name: "Freelance", amount: 15000 },
    { id: 3, name: "Investments", amount: 8000 },
  ]);

  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
  });

  const handleAddIncome = (e) => {
    e.preventDefault();
    const { name, amount } = newIncome;

    if (!name || !amount) return;

    const newId = incomes.length + 1;
    setIncomes([
      ...incomes,
      {
        id: newId,
        name,
        amount: Number(amount),
      },
    ]);

    setNewIncome({ name: "", amount: "" });
  };

  const handleDeleteIncome = (id) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
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
            <p>No incomes added yet.</p>
          ) : (
            <ul className="income-list">
              {incomes.map((income) => (
                <li key={income.id} className="income-item">
                  <span>
                    💰 <strong>{income.name}</strong> + ₹{income.amount}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteIncome(income.id)}
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
