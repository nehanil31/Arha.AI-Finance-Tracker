import accountModel from "../models/account.models.js";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.find({ user: req.user.id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch accounts" });
  }
};

export const addAccount = async (req, res) => {
  const { type, balance } = req.body;
  try {
    const account = await accountModel.create({
      user: req.user.id,
      type,
      balance,
    });
    const savedAccount = await account.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(400).json({ message: "Failed to add account" });
  }
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { type, balance } = req.body;
  try {
    const account = await accountModel.findById({
      _id: id,
      user: req.user._id,
    });
    if (!account) {
      return res.status(404).josn({ message: "Account not found" });
    }
    account.type = type || account.type;
    account.balance = balance !== undefined ? balance : account.balance;
    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: "Failed to update account" });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await accountModel.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete account" });
  }
};
