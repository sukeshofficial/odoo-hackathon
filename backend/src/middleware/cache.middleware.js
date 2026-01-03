const LRU = require("lru-cache");

const cache = new LRU({
  max: 500,
  ttl: 1000 * 60 * 10 // default 10 min
});

const cacheMiddleware = (ttlMs) => (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached) {
    return res.json(cached);
  }

  const json = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body, { ttl: ttlMs });
    json(body);
  };

  next();
};

module.exports = cacheMiddleware;
