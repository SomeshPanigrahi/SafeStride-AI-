

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

  if (err.name === "CastError") {
    statusCode = 400;
    err.message = "Invalid resource ID";
  }


  if (err.code === 11000) {
    statusCode = 400;
    err.message = "Duplicate field value entered";
  }


  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    err.message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    err.message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",

 
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