require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../models/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || password.length < 6) {
    return res.status(400).json({ message: "Неверные данные" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: err.message });

    // Добавляем role = 'admin'
    db.run(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, hash, "admin"],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(409).json({ message: "Пользователь существует" });
          }
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: "Пользователь создан" });
      }
    );
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Неверные данные" });
    }

    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (!match) {
        return res.status(401).json({ message: "Неверные данные" });
      }

      // ГЕНЕРИРУЕМ ТОКЕН!
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      // Cookie с токеном
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.json({
        message: "Успешный логин",
        user: { username: user.username, role: user.role },
      });
    });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Выйден из системы" });
});

module.exports = router;
