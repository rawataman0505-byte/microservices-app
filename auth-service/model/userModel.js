// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // ensures unique email
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // hide password from queries by default
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if not changed
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ✅ Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
