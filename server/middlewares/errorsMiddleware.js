const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400; // Bad Request
        const errors = Object.values(err.errors).map((el) => el.message);
        message = errors.join(", ");
    }

    // Handle duplicate key error (MongoDB)
    if (err.code === 11000) {
        statusCode = 400; // Bad Request
        const fieldName = Object.keys(err.keyValue)[0];
        message = `${fieldName} field must be unique`;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorMiddleware;
