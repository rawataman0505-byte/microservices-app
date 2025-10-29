const jwt = require("jsonwebtoken");

exports.signToken = (userId, email) => {
  return jwt.sign(
    { data: { userId: userId, email: email } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};
