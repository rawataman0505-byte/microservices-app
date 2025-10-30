const express = require("express");
const router = express.Router();
// const { validateSignup, validateLogin } = require("../middleware/validateRequest");
const { signup, login, profile, getAllUsers } = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware")
// Apply middleware for validation
router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllusers", getAllUsers);
router.get("/profile",protect, profile );


module.exports = router;
