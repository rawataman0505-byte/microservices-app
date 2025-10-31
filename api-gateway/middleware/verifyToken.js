

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ✅ Attach user info to headers before proxy forwards the request
    req.headers["x-user-id"] = decoded.id || decoded._id;
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
};