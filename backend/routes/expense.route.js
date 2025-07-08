import express from "express";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes
router
  .route("/")
  .get(protect, getExpenses) // Get user’s expenses
  .post(protect, addExpense); // Add a new expense

router
  .route("/:id")
  .put(protect, updateExpense) // Update expense
  .delete(protect, deleteExpense); // Delete expense

export default router;
