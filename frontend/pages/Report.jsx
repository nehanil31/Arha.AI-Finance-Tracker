import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Report.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import API from "../src/api/axiosInstance"; // Axios instance with token

const ReportsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all data from backend
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
        console.error("Failed to fetch report data:", err);
        alert("Error loading reports. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading report...</p>;

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  // Simple AI Prediction (10% growth)
  const predictedMonthlyExpense = totalExpenses * 1.1;
  const predictedYearlyExpense = predictedMonthlyExpense * 12;

  // ✅ Download Excel with backend data
  const handleDownloadExcel = () => {
    const wsExpenses = XLSX.utils.json_to_sheet(expenses);
    const wsIncomes = XLSX.utils.json_to_sheet(incomes);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsExpenses, "Expenses");
    XLSX.utils.book_append_sheet(wb, wsIncomes, "Incomes");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Finance_Report.xlsx");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-container">
        <h1>Reports</h1>

        {/* Overall Summary */}
        <div className="section summary-section">
          <h2>Overall Summary</h2>
          <div className="summary-cards">
            <div className="card">
              <h3>Total Balance</h3>
              <p>₹{totalBalance.toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Total Expenses</h3>
              <p>₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="card">
              <h3>Total Income</h3>
              <p>₹{totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Predicted Expenses */}
        <div className="section prediction-section">
          <h2>Predicted Expenses (AI)</h2>
          <div className="predictions">
            <div className="prediction-card">
              <h4>Monthly</h4>
              <p>₹{predictedMonthlyExpense.toLocaleString()}</p>
            </div>
            <div className="prediction-card">
              <h4>Yearly</h4>
              <p>₹{predictedYearlyExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Download Excel */}
        <div className="section download-section">
          <h2>Download Report</h2>
          <button className="download-btn" onClick={handleDownloadExcel}>
            📥 Download as Excel
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
