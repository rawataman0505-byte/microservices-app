

const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Attach user info as a header for downstream microservices
    req.headers["x-user-id"] = decoded.data.userId;
    req.headers["x-user-email"] = decoded.data.email;
    
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
};