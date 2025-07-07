import express from "express";
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/account.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes
router
  .route("/")
  .get(protect, getAccounts) // Get user’s accounts
  .post(protect, addAccount); // Add a new account

router
  .route("/:id")
  .put(protect, updateAccount) // Update account
  .delete(protect, deleteAccount); // Delete account

export default router;
