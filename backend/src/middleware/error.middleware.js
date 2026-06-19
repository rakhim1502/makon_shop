import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    logger.error((err.statusCode || 500) + ' - ' + err.message + ' - ' + req.originalUrl + ' - ' + req.method);

    if (err.name === 'CastError') {
        error = ApiError.badRequest('Resurs topilmadi');
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        error = ApiError.badRequest(field + ' allaqachon mavjud');
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = ApiError.badRequest(message);
    }

    if (err.name === 'JsonWebTokenError') {
        error = ApiError.unauthorized('Notogi token');
  }

    if (err.name === 'TokenExpiredError') {
        error = ApiError.unauthorized('Token muddati tugagan');
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server xatoligi',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
