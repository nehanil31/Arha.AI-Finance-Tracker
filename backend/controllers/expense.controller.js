import expenseModel from "../models/expense.models.js";
// Get all expenses for the logged-in user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.find({ user: req.user._id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// Add a new expense
export const addExpense = async (req, res) => {
  const { name, amount, category, accountId } = req.body;

  try {
    const expense = new expenseModel({
      user: req.user._id,
      name,
      amount,
      category,
      account: accountId,
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: "Failed to add expense" });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { name, amount, category } = req.body;

  try {
    const expense = await expenseModel.findOne({ _id: id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.name = name || expense.name;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category || expense.category;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: "Failed to update expense" });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await expenseModel.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete expense" });
  }
};
