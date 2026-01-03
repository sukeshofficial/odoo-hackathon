const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});
