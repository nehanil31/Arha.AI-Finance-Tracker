import incomeModel from "../models/income.model";

// Get all incomes for the logged-in user
export const getIncomes = async (req, res) => {
  try {
    const incomes = await incomeModel.find({ user: req.user._id });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch incomes" });
  }
};

// Add a new income
export const addIncome = async (req, res) => {
  const { name, amount, accountId } = req.body;

  try {
    const income = new incomeModel({
      user: req.user._id,
      name,
      amount,
      account: accountId,
    });
    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ message: "Failed to add income" });
  }
};

// Update an income
export const updateIncome = async (req, res) => {
  const { id } = req.params;
  const { name, amount } = req.body;

  try {
    const income = await incomeModel.findOne({ _id: id, user: req.user._id });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    income.name = name || income.name;
    income.amount = amount !== undefined ? amount : income.amount;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: "Failed to update income" });
  }
};

// Delete an income
export const deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const income = await incomeModel.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete income" });
  }
};
