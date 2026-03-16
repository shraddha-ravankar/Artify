
// Handles 404 errors - requests for routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware
};

// Handles all other errors in the application
const errorHandler = (err, req, res, next) => {
  // If the status code is 200 (OK), set it to 500 (Server Error) instead
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose specific error for bad ObjectIDs
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message: message,
    // Show the error stack only if we are not in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };