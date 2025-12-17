const express = require("express");
const router = express.Router();
const db = require("../models/config");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// GET все контакты
router.get("/", (req, res) => {
  db.all("SELECT * FROM contacts", (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST создать контакты
//phone,telegram,whatsapp,address,map_url
router.post("/", authMiddleware, adminMiddleware, (req, res) => {
  const { phone, telegram, whatsapp, address, map_url } = req.body;

  if (!phone && !telegram && !whatsapp && !address && !map_url) {
    return res.status(400).json({ message: "Нужно указать хотя бы одно поле" });
  }

  db.run(
    `INSERT INTO contacts (phone, telegram, whatsapp, address, map_url)
     VALUES (?, ?, ?, ?, ?)`,
    [
      phone || null,
      telegram || null,
      whatsapp || null,
      address || null,
      map_url || null,
    ],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "Контакты добавлены", id: this.lastID });
    }
  );
});

// изменить любое
router.patch("/:id", authMiddleware, adminMiddleware, (req, res) => {
  const updates = {};

  if (req.body.phone !== undefined) updates.phone = req.body.phone;
  if (req.body.telegram !== undefined) updates.telegram = req.body.telegram;
  if (req.body.whatsapp !== undefined) updates.whatsapp = req.body.whatsapp;
  if (req.body.address !== undefined) updates.address = req.body.address;
  if (req.body.map_url !== undefined) updates.map_url = req.body.map_url;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Нет данных для обновления" });
  }

  const setClause = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updates);
  values.push(req.params.id);

  db.run(
    `UPDATE contacts SET ${setClause} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Контакт не найден" });
      }
      res.status(200).json({ message: "Контакт обновлён" });
    }
  );
});

module.exports = router;
