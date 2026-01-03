const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // путь к твоему upload.js

const db = require("../models/config"); // уже открытая
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// READ (без изменений)
router.get("/", (req, res) => {
  db.all("SELECT * FROM services", (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(rows);
  });
});

router.get("/:url", (req, res) => {
  db.get(
    `SELECT * FROM services WHERE url = ?`,
    [req.params.url],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ message: "Нет такой услуги" });
      }
      res.json(row);
    }
  );
});

// CREATE с загрузкой фото
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  (req, res) => {
    const { url, title, description, main_price } = req.body;

    // валидация
    if (!url || !title || !description || !main_price) {
      return res.status(400).json({
        message: "Название, описание и цена - обязательны к заполнению",
      });
    }

    db.get(`SELECT url FROM services WHERE url = ?`, [url], (err, existing) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (existing) {
        return res
          .status(409)
          .json({ message: `Услуга с адресом ${url} уже существует` });
      }

      // Путь к фото или дефолт
      const image_url = req.file
        ? `uploads/${req.file.filename}`
        : "uploads/default-service.jpg";

      // INSERT с image_url
      db.run(
        `INSERT INTO services (url, title, description, main_price, image_url) VALUES (?,?,?,?,?)`,
        [url, title, description, main_price, image_url],
        (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          res.status(201).json({
            message: `Услуга "${title}" успешно добавлена`,
            image_url,
          });
        }
      );
    });
  }
);

// UPDATE с загрузкой фото
router.patch(
  "/:url",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  (req, res) => {
    const updates = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined)
      updates.description = req.body.description;
    if (req.body.main_price !== undefined)
      updates.main_price = req.body.main_price;

    // Если новое фото загружено
    if (req.file) {
      updates.image_url = `uploads/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Нет данных для обновления" });
    }

    // строка для SQL
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");

    // значения
    const values = Object.values(updates);
    values.push(req.params.url);

    db.run(`UPDATE services SET ${setClause} WHERE url = ?`, values, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Услуга не найдена" });
      }
      res.status(200).json({ message: "Обновлено!" });
    });
  }
);

// DELETE (без изменений)
router.delete("/:url", authMiddleware, adminMiddleware, (req, res) => {
  db.run(
    "DELETE FROM services WHERE url = ?",
    [req.params.url],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ message: "Услуга не найдена" });
      }
      res.status(200).json({ message: "Услуга удалена" });
    }
  );
});

module.exports = router;
