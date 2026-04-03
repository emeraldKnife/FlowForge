const jwt = require("jsonwebtoken");

const JWT_SECRET = "flowforge_super_secret_key_2026_secure_random";

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
