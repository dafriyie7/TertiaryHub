/**
 * Middleware to handle errors.
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging purposes
    console.error(err.stack);

    // Check if headers have already been sent to prevent sending headers again
    if (res.headersSent) {
        return next(err); // Forward error to the default Express error handler
    }

    // Determine the status code and error message
    let statusCode = err.status || 500; // Default to 500 Internal Server Error
    let errorMessage = err.message || 'Internal Server Error';

    // Handle specific types of errors
    if (err.name === 'UnauthorizedError') {
        statusCode = 401; // Unauthorized
        errorMessage = 'Unauthorized access';
    } else if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
        errorMessage = `Validation Error: ${err.message}`;
    } else if (err.name === 'NotFoundError') {
        statusCode = 404; // Not Found
        errorMessage = 'Resource not found';
    }

    // Send the error response
    res.status(statusCode).json({
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development mode
    });
};

module.exports = errorHandler;