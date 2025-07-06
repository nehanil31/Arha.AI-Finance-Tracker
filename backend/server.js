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
app.use("/api/v1/users", userRouter);
// Start server on port 4000
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
