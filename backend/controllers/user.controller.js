import UserModel from "../models/user.models.js";
import jwt from "jsonwebtoken";

//generate token function -> takes user id as input
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user || !(await UserModel.comparePassword(password))) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Get All Users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // exclude passwords
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
