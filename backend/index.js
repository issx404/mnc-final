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
// подключаем middleware
app.use(requestLogger);
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/zayavki", zayavkiRouter);

app.get("/", (req, res) => {
  res.send({ name: "Мастер на час", description: "Служба бытового сервиса" });
});

app.listen(port, () => {
  console.log(`.:: СЕРВЕР ЗАПУЩЕН ПО АДРЕСУ: http://127.0.0.1:${port} ::.`);
});
