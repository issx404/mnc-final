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
