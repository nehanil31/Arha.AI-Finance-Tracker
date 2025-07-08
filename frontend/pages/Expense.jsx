import React, { useEffect, useState } from "react";
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
import API from "../src/api/axiosInstance"; // Axios with JWT

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "",
  });

  // ✅ Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await API.get("/expenses");
        setExpenses(data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        alert("Error loading expenses. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // ✅ Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const { name, amount, category } = newExpense;

    if (!name || !amount || !category) return;

    try {
      const { data } = await API.post("/expenses", {
        name,
        amount: Number(amount),
        category,
      });
      setExpenses([...expenses, data]); // Update state
      setNewExpense({ name: "", amount: "", category: "" });
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Error adding expense");
    }
  };

  // ✅ Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
      alert("Error deleting expense");
    }
  };

  // ✅ Prepare data for Pie Chart
  const expenseData = expenses.reduce((acc, curr) => {
    const found = acc.find((item) => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  if (loading) return <p>Loading...</p>;

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
            <p>No expenses found.</p>
          ) : (
            <ul className="expenses-list">
              {expenses.map((expense) => (
                <li key={expense._id} className="expense-item">
                  <span>
                    💸 <strong>{expense.name}</strong> - ₹{expense.amount} [
                    {expense.category}]
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteExpense(expense._id)}
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
