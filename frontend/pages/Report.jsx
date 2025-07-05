import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Report.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ReportsPage = () => {
  // Dummy data (you can fetch this from backend later)
  const [accounts] = useState([
    { id: 1, type: "Wallet", balance: 15000 },
    { id: 2, type: "Bank", balance: 50000 },
    { id: 3, type: "Crypto", balance: 5000 },
  ]);

  const [expenses] = useState([
    { id: 1, name: "Groceries", amount: 1200, date: "2025-07-01" },
    { id: 2, name: "Transport", amount: 800, date: "2025-07-03" },
    { id: 3, name: "Utilities", amount: 1500, date: "2025-07-05" },
  ]);

  const [incomes] = useState([
    { id: 1, name: "Salary", amount: 50000, date: "2025-07-01" },
    { id: 2, name: "Freelance", amount: 8000, date: "2025-07-10" },
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  // Simple AI Prediction Placeholder (average expense * months)
  const predictedMonthlyExpense = totalExpenses * 1.1; // +10% growth
  const predictedYearlyExpense = predictedMonthlyExpense * 12;

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
