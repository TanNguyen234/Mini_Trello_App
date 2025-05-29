const jwt = require("jsonwebtoken");

exports.authenticateToken = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split("Bearer ")[1] : null;
  if (!token) return res.status(401).send("No token");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
};