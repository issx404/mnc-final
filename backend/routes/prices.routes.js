const express = require("express");
const router = express.Router();

const db = require("../models/config"); // уже открытая
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// READ
// id, service_id, title, description, price, images_url
router.get("/", (req, res) => {
  db.all(`SELECT * FROM prices`, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(rows);
  });
});

router.get("/all/:service_id", (req, res) => {
  db.all(
    `SELECT * FROM prices WHERE service_id = ?`,
    [req.params.service_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(rows);
    }
  );
});

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM prices WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Позиция прайса не найдена" });
    }
    res.json(row);
  });
});

// id, service_id, title, description, price, images_url
// CREATE
router.post("/", authMiddleware, adminMiddleware, (req, res) => {
  const { service_id, title, description, price } = req.body;

  if (!service_id || !title || !description || !price) {
    return res
      .status(400)
      .json({ message: "Все поля обязательны к заполнению!" });
  }

  db.get(`SELECT * FROM prices WHERE title = ?`, [title], (err, row) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (row) {
      return res
        .status(409)
        .json({ message: `Услуга ${title} уже существует!` });
    }
    db.run(
      `INSERT INTO prices (service_id, title, description, price) VALUES (?,?,?,?)`,
      [service_id, title, description, price],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ message: "Не удалось добавить данные" });
        }
        res
          .status(201)
          .json({ message: `Успешно добавлен прайс, id = ${this.lastID}` });
      }
    );
  });
});

// id, service_id, title, description, price, images_url
// UPDATE

router.patch("/:id", authMiddleware, adminMiddleware, (req, res) => {
  const updates = {};

  if (req.body.service_id !== undefined)
    updates.service_id = req.body.service_id;
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.description !== undefined)
    updates.description = req.body.description;
  if (req.body.price !== undefined) updates.price = req.body.price;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Нет данных для обновления" });
  }

  const setClause = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updates);
  values.push(req.params.id);

  db.run(`UPDATE prices SET ${setClause} WHERE id = ?`, values, function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Позиция прайса не найдена" });
    }
    res.status(200).json({ message: "Позиция прайса обновлена" });
  });
});

// DELETE
router.delete("/:id", authMiddleware, adminMiddleware, (req, res) => {
  db.run("DELETE FROM prices WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Позиция прайса не найдена" });
    }
    res.status(200).json({ message: "Позиция прайса удалена" });
  });
});

module.exports = router;
