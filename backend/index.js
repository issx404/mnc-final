require("dotenv").config();
const express = require("express");
const requestLogger = require("./middleware/logger");
const servicesRouter = require("./routes/services.routes");
const pricesRouter = require("./routes/prices.routes");
const contactsRouter = require("./routes/contacts.routes");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;
// безопасность
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173"], // фронт
    credentials: true, // cookie
  })
);
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с IP
  message: { message: "Слишком много запросов" },
});
const helmet = require("helmet");
app.use(helmet()); // защита от XSS, кликджекинга

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

app.get("/", (req, res) => {
  res.send({ name: "Мастер на час", description: "Служба бытового сервиса" });
});

app.listen(port, () => {
  console.log(`.:: СЕРВЕР ЗАПУЩЕН ПО АДРЕСУ: http://127.0.0.1:${port} ::.`);
});
