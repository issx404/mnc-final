const express = require("express");
const router = express.Router();

const db = require("../models/config"); // уже открытая

router.get("/", (req, res) => {
  db.all("SELECT * FROM services", (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(rows);
  });
});

router.get("/:url", (req, res) => {
  let service = services.find((service) => service.url === req.params.url);
  if (!service) {
    return res.status(404).json({ message: "Услуга не найдена" });
  }
  res.json(service);
});

// POST асинхрон

router.post("/", (req, res) => {
  const { url, title, description, main_price } = req.body;
  // типо валидация лол
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

    // добавление в бд
    db.run(
      `INSERT INTO services (url, title, description, main_price) VALUES (?,?,?,?)`,
      [url, title, description, main_price],
      (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res
          .status(201)
          .json({ message: `Услуга "${title}" успешно добавлена` });
      }
    );
  });
});

module.exports = router;
