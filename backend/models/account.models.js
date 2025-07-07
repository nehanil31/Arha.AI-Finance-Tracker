import mongoose from "mongoose";

const accountScheme = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

const accountModel = mongoose.model("Account", accountScheme);
export default accountModel;
