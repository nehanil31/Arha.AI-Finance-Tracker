import expenseModel from "../models/expense.models.js";
import incomeModel from "../models/income.model.js";
import ExcelJS from "exceljs";

// Get overall report data // need to know about this code

export const getReport = async (req, res) => {
  try {
    const totalExpenses = await expenseModel.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncomes = await incomeModel.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalExpenses: totalExpenses[0]?.total || 0,
      totalIncomes: totalIncomes[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};

// Predict monthly and yearly expenses (basic AI logic)
export const getPredictedExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.find({ user: req.user._id });
    const avgMonthlyExpense =
      expenses.reduce((sum, e) => sum + e.amount, 0) / 12;

    res.json({
      predictedMonthly: avgMonthlyExpense.toFixed(2),
      predictedYearly: (avgMonthlyExpense * 12).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to predict expenses" });
  }
};

// Download report as Excel
export const downloadExcel = async (req, res) => {
  try {
    const expenses = await expenseModel.find({ user: req.user._id });
    const incomes = await incomeModel.find({ user: req.user._id });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Finance Report");

    sheet.addRow(["Type", "Name", "Amount", "Category/Account"]);

    expenses.forEach((e) =>
      sheet.addRow(["Expense", e.name, e.amount, e.category])
    );
    incomes.forEach((i) =>
      sheet.addRow(["Income", i.name, i.amount, i.account])
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Failed to generate Excel report" });
  }
};
