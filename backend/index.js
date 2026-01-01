require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const requestLogger = require("./middleware/logger");
const servicesRouter = require("./routes/services.routes");
const pricesRouter = require("./routes/prices.routes");
const contactsRouter = require("./routes/contacts.routes");
const authRouter = require("./routes/auth.routes");
const zayavkiRouter = require("./routes/zayavki.routes");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT;

// безопасность
app.use(helmet()); // защита от XSS, кликджекинга
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);
app.set("trust proxy", 1); // для HTTPS reverse proxy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с IP
  message: { message: "Слишком много запросов" },
});

//
app.use(limiter);
app.use(cookieParser());
app.use(express.json()); // для обработки json запросов с фронта через req.body

// Настройка Multer: сохраняем в uploads с уникальным именем
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Только изображения!"), false);
  },
});

// Middleware для парсинга форм
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Для статических файлов (HTML)

// Маршрут для загрузки одного фото товара
app.post("/upload-photo", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).send("Файл не загружен");
  res.json({
    message: "Фото товара загружено!",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

// подключаем middleware
app.use(requestLogger);
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/uploads", express.static("uploads")); // для отдачи фото по /uploads/filename.jpg
app.use("/api/prices", pricesRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/zayavki", zayavkiRouter);

app.get("/", (req, res) => {
  res.send({ name: "Мастер на час", description: "Служба бытового сервиса" });
});

app.listen(port, () => {
  console.log(`.:: СЕРВЕР ЗАПУЩЕН ПО АДРЕСУ: http://127.0.0.1:${port} ::.`);
});
