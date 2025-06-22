export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  const message = err.expose ? err.message : err.message;

  res.status(status).json({
    status,
    message,
    data: {},
  });
}
