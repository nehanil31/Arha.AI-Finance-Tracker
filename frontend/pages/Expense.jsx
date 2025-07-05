import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Expense.css";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Groceries", amount: 2000, category: "Food" },
    { id: 2, name: "Bus Ticket", amount: 500, category: "Transport" },
    { id: 3, name: "Netflix", amount: 800, category: "Entertainment" },
  ]);

  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    const { name, amount, category } = newExpense;

    if (!name || !amount || !category) return;

    const newId = expenses.length + 1;
    setExpenses([
      ...expenses,
      {
        id: newId,
        name,
        amount: Number(amount),
        category,
      },
    ]);

    setNewExpense({ name: "", amount: "", category: "" });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const expenseData = expenses.reduce((acc, curr) => {
    const found = acc.find((item) => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-container">
        <h1>Expenses</h1>

        {/* Chart Section */}
        <div className="section chart-section">
          <h2>Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Add Expense Form */}
        <div className="section add-expense-section">
          <h2>Add New Expense</h2>
          <form className="expense-form" onSubmit={handleAddExpense}>
            <input
              type="text"
              placeholder="Expense Name"
              value={newExpense.name}
              onChange={(e) =>
                setNewExpense({ ...newExpense, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              required
            />
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
            </select>
            <button type="submit" className="add-btn">
              + Add Expense
            </button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="section expenses-list-section">
          <h2>All Expenses</h2>
          {expenses.length === 0 ? (
            <p>No expenses added yet.</p>
          ) : (
            <ul className="expenses-list">
              {expenses.map((expense) => (
                <li key={expense.id} className="expense-item">
                  <span>
                    💸 <strong>{expense.name}</strong> - ₹{expense.amount} [
                    {expense.category}]
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteExpense(expense.id)}
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

export default ExpensesPage;
