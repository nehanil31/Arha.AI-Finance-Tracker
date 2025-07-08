import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
import userRouter from "./routes/user.route.js";
import accountRouter from "./routes/account.route.js";
import expenseRouter from "./routes/expense.route.js";
import incomeRouter from "./routes/income.route.js";
import reportRouter from "./routes/report.route.js";
app.use("/api/users", userRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/incomes", incomeRouter);
app.use("/api/reports", reportRouter);
// Start server on port 4000
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
