module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "An internal server error has occurred" : err.message;

  res.status(statusCode).send({ message });
};
