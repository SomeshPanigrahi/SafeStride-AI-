// const notFound = (req, res, next) => {
//   const error = new Error(`Not Found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

//   res.status(statusCode);

//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack
//   });
// };

// module.exports = { notFound, errorHandler };

const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode;

  // If no status set → internal server error
  if (statusCode === 200) {
    statusCode = 500;
  }

  // ==============================
  // MONGODB INVALID OBJECT ID
  // ==============================
  if (err.name === "CastError") {
    statusCode = 400;
    err.message = "Invalid resource ID";
  }

  // ==============================
  // MONGOOSE DUPLICATE KEY
  // ==============================
  if (err.code === 11000) {
    statusCode = 400;
    err.message = "Duplicate field value entered";
  }

  // ==============================
  // JWT ERRORS
  // ==============================
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    err.message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    err.message = "Token expired";
  }

  // ==============================
  // FINAL RESPONSE
  // ==============================
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",

    // show stack only in development
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};