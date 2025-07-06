import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      // select: false, // Prevent password from being returned in queries
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Method to compare passwords (for login)
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
