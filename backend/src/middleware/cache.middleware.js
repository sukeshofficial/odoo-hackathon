const { LRUCache } = require("lru-cache");

// Create cache instance
const cache = new LRUCache({
  max: 500,                 // max items
  ttl: 1000 * 60 * 10       // 10 minutes
});

const cacheMiddleware = (ttlMs) => (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached) {
    return res.json(cached);
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    cache.set(key, body, { ttl: ttlMs });
    originalJson(body);
  };

  next();
};

module.exports = cacheMiddleware;
