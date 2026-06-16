export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = status === 500 ? "Something went wrong while processing the project." : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    error: message,
    details: err.details || undefined
  });
}
