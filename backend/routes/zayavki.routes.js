const express = require("express");
const router = express.Router();
const db = require("../models/config");
const { authMiddleware } = require("../middleware/auth");

router.post("/", (req, res) => {
  const { client, phone, address, service_title, commentary } = req.body;

  // валидация телефона
  if (!phone.match(/^\+7\d{10}$/)) {
    return res
      .status(400)
      .json({ error: "Неверный формат телефона (+79991234567)" });
  }

  // если "Другое" — service_id = NULL
  if (service_title === "Другое") {
    db.run(
      `INSERT INTO zayavki (client, phone, address, service_id, commentary) 
       VALUES (?, ?, ?, ?, ?)`,
      [client, phone, address, null, commentary || "Другое"],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Ошибка создания заявки" });
        res.json({
          id: this.lastID,
          message: "Заявка создана!",
        });
      }
    );
    return;
  }

  // иначе ищем service_id по title
  db.get(
    "SELECT id FROM services WHERE title = ?",
    [service_title],
    (err, service) => {
      if (err) return res.status(500).json({ error: "Ошибка БД" });
      if (!service) return res.status(400).json({ error: "Услуга не найдена" });

      // создаём заявку с service_id
      db.run(
        `INSERT INTO zayavki (client, phone, address, service_id, commentary) 
         VALUES (?, ?, ?, ?, ?)`,
        [client, phone, address, service.id, commentary],
        function (err) {
          if (err)
            return res.status(500).json({ error: "Ошибка создания заявки" });
          res.json({
            id: this.lastID,
            message: "Заявка создана!",
          });
        }
      );
    }
  );
});

// список заявок (админ)
router.get("/", authMiddleware, (req, res) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Только для админа" });
  }

  db.all(
    `
    SELECT z.*, s.title as service_title 
    FROM zayavki z 
    LEFT JOIN services s ON z.service_id = s.id 
    ORDER BY z.created_at DESC
  `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Ошибка БД" });
      res.json(rows);
    }
  );
});

// поменять статус заявки
router.patch("/:id/status", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Только для админа" });
  }

  db.run(
    "UPDATE zayavki SET status = ? WHERE id = ?",
    [status ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: "Ошибка обновления" });
      if (this.changes === 0)
        return res.status(404).json({ error: "Заявка не найдена" });
      res.json({ message: "Статус обновлён" });
    }
  );
});

// удалить заявку (только админ)
router.delete("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ error: "Только для админа" });
  }

  db.run("DELETE FROM zayavki WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Ошибка удаления заявки" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }
    res.json({ message: "Заявка удалена" });
  });
});

module.exports = router;
