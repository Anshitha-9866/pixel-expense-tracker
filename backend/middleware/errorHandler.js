// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack || err.message);

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : "Internal server error";

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
