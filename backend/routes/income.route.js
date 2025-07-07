import express from "express";
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/income.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes
router
  .route("/")
  .get(protect, getIncomes) // Get user’s incomes
  .post(protect, addIncome); // Add a new income

router
  .route("/:id")
  .put(protect, updateIncome) // Update income
  .delete(protect, deleteIncome); // Delete income

export default router;
