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
import Sidebar from "../components/Sidebar";
import API from "../src/api/axiosInstance";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const Dashboard = () => {
  const [view, setView] = useState("monthly");
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editedBalance, setEditedBalance] = useState("");

  const [newAccount, setNewAccount] = useState({ type: "", balance: "" });
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

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/accounts", {
        type: newAccount.type,
        balance: Number(newAccount.balance),
      });
      setAccounts([...accounts, data]);
      setNewAccount({ type: "", balance: "" });
    } catch {
      alert("Failed to add account");
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await API.delete(`/accounts/${id}`);
      setAccounts(accounts.filter((acc) => acc._id !== id));
    } catch {
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
    } catch {
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

      setAccounts((prev) =>
        prev.map((acc) =>
          acc._id === accountId
            ? { ...acc, balance: acc.balance - Number(amount) }
            : acc
        )
      );
    } catch {
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

      setAccounts((prev) =>
        prev.map((acc) =>
          acc._id === accountId
            ? { ...acc, balance: acc.balance + Number(amount) }
            : acc
        )
      );
    } catch {
      alert("Failed to add income");
    }
  };

  const chartData = [
    { name: "Expenses", value: expenses.reduce((sum, e) => sum + e.amount, 0) },
    { name: "Incomes", value: incomes.reduce((sum, i) => sum + i.amount, 0) },
  ];

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="dashboard-layout">
      {/* <Sidebar /> */}

      <main className="dashboard-container">
        <h1>Finance Tracker Dashboard</h1>

        <div className="top-section">
          {/* Accounts Section */}
          <div className="section">
            <h2>Accounts</h2>
            <div className="accounts-list">
              {accounts.map((account) => (
                <div key={account._id} className="account-card">
                  <h3>{account.type}</h3>
                  {editMode === account._id ? (
                    <>
                      <input
                        type="number"
                        value={editedBalance}
                        onChange={(e) => setEditedBalance(e.target.value)}
                      />
                      <button onClick={() => handleSaveAccount(account._id)}>
                        Save
                      </button>
                    </>
                  ) : (
                    <p>Balance: ₹{account.balance.toLocaleString()}</p>
                  )}
                  <div className="account-actions">
                    <button
                      onClick={() =>
                        handleEditAccount(account._id, account.balance)
                      }
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAccount(account._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <form className="add-account-form" onSubmit={handleAddAccount}>
                <input
                  type="text"
                  placeholder="Account Type"
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
                <button type="submit">+ Add Account</button>
              </form>
            </div>
          </div>

          {/* Overview Section */}
          <div className="section">
            <h2>Overview</h2>
            <select value={view} onChange={(e) => setView(e.target.value)}>
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
        <div className="two-column">
          {/* Expenses */}
          <div className="section">
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

            <ul className="data-list">
              {expenses.length === 0 ? (
                <li>No expenses added yet.</li>
              ) : (
                expenses.map((expense) => (
                  <li key={expense._id}>
                    💸 {expense.name} - ₹{expense.amount} [{expense.category}]
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Income */}
          <div className="section">
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

            <ul className="data-list">
              {incomes.length === 0 ? (
                <li>No incomes added yet.</li>
              ) : (
                incomes.map((income) => (
                  <li key={income._id}>
                    💰 {income.name} + ₹{income.amount}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
