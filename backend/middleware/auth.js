require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // читаем из куков
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Токен обязателен" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Неверный или истёкший токен" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Требуются права администратора" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
