const express = require("express");
const router = express.Router();
// const { validateSignup, validateLogin } = require("../middleware/validateRequest");
const { signup, login, profile } = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware")
// Apply middleware for validation
console.log("before from authRoutes")
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile",protect, profile );
console.log("after from authRoutes")

module.exports = router;
