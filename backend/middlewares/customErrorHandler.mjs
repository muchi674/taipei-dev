function handleHTTPError(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500).json({ message: err.message || "Unknown Error" });
}

export { handleHTTPError };
