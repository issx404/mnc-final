const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // npm i dayjs
const timezone = require("dayjs/plugin/timezone"); // npm i dayjs

dayjs.extend(utc);
dayjs.extend(timezone);

function requestLogger(req, res, next) {
  // 🔥 Якутск UTC+9 + 24ч формат
  const now = dayjs().tz("Asia/Yakutsk");

  console.log(
    `Новый запрос: ${req.method} ${req.url} в ${now.format(
      "DD.MM.YYYY HH:mm" // 🔥 03.01.2026 18:02 (24ч!)
    )}`
  );

  next();
}

module.exports = requestLogger;
