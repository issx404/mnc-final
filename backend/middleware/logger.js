const dayjs = require("dayjs");

function requestLogger(req, res, next) {
  const now = dayjs();
  console.log(
    `Новый запрос: ${req.method} ${req.url} в ${now.format(
      "D MMMM, YYYY h:mm A"
    )}`
  );
  next();
}

module.exports = requestLogger;
