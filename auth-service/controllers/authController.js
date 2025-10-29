const { z } = require("zod");
const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const {signToken} = require("../utils/jwtUtils")


exports.signup = catchAsync(async (req, res, next) => {

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError(400,"Email already exists"))
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id,user.email);

  res.status(201).json({
    status: "success",
    message: "User signed up successfully",
    Token: token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Validate using Zod
  const { email, password } = req.body;

  // Find user and verify password
 const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError(400, "Invalid email "));
  }

  const isPasswordValid = await user.comparePassword(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(400, "Invalid password"));
  }
  const token = signToken(user._id,user.email);


  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    Token: token,
  });
});

exports.profile = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  })}