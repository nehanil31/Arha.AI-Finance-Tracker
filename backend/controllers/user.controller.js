import UserModel from "../models/user.models.js";
import jwt from "jsonwebtoken";

//generate token function -> takes user id as input
const generateToken = (userId) => {
  console.log("generate token called");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  console.log("reached here");
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
    console.log(token);
    res.status(201).json({ user, token });
  } catch (error) {
    console.log("reached here");
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    console.log("reacher here");
    const user = await UserModel.findOne({ email }).select("+password");
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    console.log(token);
    //exclude password before sending  TODO
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
