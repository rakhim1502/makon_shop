class ApiError extends Error {
    constructor(statusCode, message, errors = [], stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = 'Notogri sorov', errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = 'Avtorizatsiya talab qilinadi') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Ruxsat yoq') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Resurs topilmadi') {
        return new ApiError(404, message);
    }

    static conflict(message = 'Konflikt') {
        return new ApiError(409, message);
    }

    static internal(message = 'Server xatoligi', errors = []) {
        return new ApiError(500, message, errors);
    }
}

export default ApiError;
