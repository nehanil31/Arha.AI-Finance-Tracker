import UserModel from "../models/user.models.js";
// import bcrypt from "bcryptjs";

// Register User
export const registerUser = async (req, res) => {
  try {
    console.log("register route hit");
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password,
    });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
