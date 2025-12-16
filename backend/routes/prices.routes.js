const express = require("express");
const router = express.Router();

const db = require("../models/config"); // уже открытая

// READ

router.get("/", (req, res) => {
  db.all(`SELECT * FROM prices`, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  res.json(rows);
});

// CREATE

module.exports = router;
