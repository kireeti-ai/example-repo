/**
 * @fileoverview Custom API Error class for structured error handling
 * Extends Error with HTTP status codes and operational error flagging.
 */

/**
 * @class ApiError
 * @extends Error
 * @description Custom error class for API errors with status codes
 */
class ApiError extends Error {
    /**
     * Creates an ApiError instance
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {boolean} [isOperational=true] - Whether error is operational (vs programming error)
     * @param {string} [stack=''] - Error stack trace
     */
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Create a 400 Bad Request error
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static badRequest(message) {
        return new ApiError(400, message);
    }

    /**
     * Create a 401 Unauthorized error
     * @param {string} [message='Unauthorized'] - Error message
     * @returns {ApiError}
     */
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }

    /**
     * Create a 403 Forbidden error
     * @param {string} [message='Forbidden'] - Error message
     * @returns {ApiError}
     */
    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    /**
     * Create a 404 Not Found error
     * @param {string} [message='Resource not found'] - Error message
     * @returns {ApiError}
     */
    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    /**
     * Create a 409 Conflict error
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static conflict(message) {
        return new ApiError(409, message);
    }

    /**
     * Create a 422 Unprocessable Entity error
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static unprocessableEntity(message) {
        return new ApiError(422, message);
    }

    /**
     * Create a 429 Too Many Requests error
     * @param {string} [message='Too many requests'] - Error message
     * @returns {ApiError}
     */
    static tooManyRequests(message = 'Too many requests') {
        return new ApiError(429, message);
    }

    /**
     * Create a 500 Internal Server Error
     * @param {string} [message='Internal server error'] - Error message
     * @returns {ApiError}
     */
    static internal(message = 'Internal server error') {
        return new ApiError(500, message, false);
    }
}

module.exports = ApiError;
