import express from "express";
import {
  getReport,
  getPredictedExpenses,
  downloadExcel,
} from "../controllers/report.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.get("/", protect, getReport); // Get report data
router.get("/predict", protect, getPredictedExpenses); // Predict expenses
router.get("/download", protect, downloadExcel); // Download Excel file

export default router;
