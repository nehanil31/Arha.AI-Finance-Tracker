import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../src/api/axiosInstance"; // Axios instance with token

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const Dashboard = () => {
  const [view, setView] = useState("monthly");
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "",
    accountId: "",
  });

  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: "",
    accountId: "",
  });

  const [newAccount, setNewAccount] = useState({
    type: "",
    balance: "",
  });

  const [editMode, setEditMode] = useState(null);
  const [editedBalance, setEditedBalance] = useState("");

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, expensesRes, incomesRes] = await Promise.all([
          API.get("/accounts"),
          API.get("/expenses"),
          API.get("/incomes"),
        ]);
        setAccounts(accountsRes.data);
        setExpenses(expensesRes.data);
        setIncomes(incomesRes.data);
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("Error fetching data. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewChange = (newView) => setView(newView);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/accounts", {
        type: newAccount.type,
        balance: Number(newAccount.balance),
      });
      setAccounts([...accounts, data]);
      setNewAccount({ type: "", balance: "" });
    } catch (err) {
      alert("Failed to add account");
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await API.delete(`/accounts/${id}`);
      setAccounts(accounts.filter((acc) => acc._id !== id));
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  const handleEditAccount = (id, currentBalance) => {
    setEditMode(id);
    setEditedBalance(currentBalance);
  };

  const handleSaveAccount = async (id) => {
    try {
      const { data } = await API.put(`/accounts/${id}`, {
        balance: Number(editedBalance),
      });
      setAccounts(
        accounts.map((acc) =>
          acc._id === id ? { ...acc, balance: data.balance } : acc
        )
      );
      setEditMode(null);
      setEditedBalance("");
    } catch (err) {
      alert("Failed to update account");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const { name, amount, category, accountId } = newExpense;
      const { data } = await API.post("/expenses", {
        name,
        amount: Number(amount),
        category,
        accountId,
      });
      setExpenses([...expenses, data]);
      setNewExpense({ name: "", amount: "", category: "", accountId: "" });

      // Update account balance locally
      const updatedAccounts = accounts.map((acc) =>
        acc._id === accountId
          ? { ...acc, balance: acc.balance - Number(amount) }
          : acc
      );
      setAccounts(updatedAccounts);
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const { name, amount, accountId } = newIncome;
      const { data } = await API.post("/incomes", {
        name,
        amount: Number(amount),
        accountId,
      });
      setIncomes([...incomes, data]);
      setNewIncome({ name: "", amount: "", accountId: "" });

      // Update account balance locally
      const updatedAccounts = accounts.map((acc) =>
        acc._id === accountId
          ? { ...acc, balance: acc.balance + Number(amount) }
          : acc
      );
      setAccounts(updatedAccounts);
    } catch (err) {
      alert("Failed to add income");
    }
  };

  const chartData = [
    { name: "Expenses", value: expenses.reduce((sum, e) => sum + e.amount, 0) },
    { name: "Incomes", value: incomes.reduce((sum, i) => sum + i.amount, 0) },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-container">
        <h1>Finance Tracker Dashboard</h1>

        <div className="top-section">
          {/* Accounts Section */}
          <div className="section accounts-section">
            <h2>Accounts</h2>
            <div className="accounts-list">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className={`account-card ${account.type.toLowerCase()}`}
                >
                  <h3>{account.type}</h3>
                  {editMode === account._id ? (
                    <>
                      <input
                        type="number"
                        value={editedBalance}
                        onChange={(e) => setEditedBalance(e.target.value)}
                        className="edit-input"
                      />
                      <button
                        onClick={() => handleSaveAccount(account._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <p>Balance: ₹{account.balance.toLocaleString()}</p>
                  )}
                  <div className="account-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditAccount(account._id, account.balance)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAccount(account._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Account Form */}
              <form className="add-account-form" onSubmit={handleAddAccount}>
                <input
                  type="text"
                  placeholder="Account Type (e.g. Wallet)"
                  value={newAccount.type}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, type: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Initial Balance"
                  value={newAccount.balance}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, balance: e.target.value })
                  }
                  required
                />
                <button type="submit" className="add-account">
                  + Add Account
                </button>
              </form>
            </div>
          </div>

          {/* Overview Section */}
          <div className="section overview-section">
            <h2>Overview</h2>
            <select
              className="view-select"
              value={view}
              onChange={(e) => handleViewChange(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
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
        </div>

        {/* Expenses & Income Section */}
        <div className="expenses-income-container">
          {/* Expenses */}
          <div className="section expenses-section">
            <h2>Add Expense</h2>
            <form onSubmit={handleAddExpense}>
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
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              <select
                value={newExpense.accountId}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, accountId: e.target.value })
                }
                required
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.type} (₹{acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
              <button type="submit">Add Expense</button>
            </form>

            <div className="expenses-list">
              <h3>Expenses:</h3>
              {expenses.length === 0 ? (
                <p>No expenses added yet.</p>
              ) : (
                <ul>
                  {expenses.map((expense) => (
                    <li key={expense._id}>
                      💸 {expense.name} - ₹{expense.amount} [{expense.category}]
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Income */}
          <div className="section income-section">
            <h2>Add Income</h2>
            <form onSubmit={handleAddIncome}>
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
              <select
                value={newIncome.accountId}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, accountId: e.target.value })
                }
                required
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.type} (₹{acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
              <button type="submit">Add Income</button>
            </form>

            <div className="income-list">
              <h3>Incomes:</h3>
              {incomes.length === 0 ? (
                <p>No incomes added yet.</p>
              ) : (
                <ul>
                  {incomes.map((income) => (
                    <li key={income._id}>
                      💰 {income.name} + ₹{income.amount}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
