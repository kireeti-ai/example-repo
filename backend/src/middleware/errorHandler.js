/**
 * @fileoverview Centralized error handling middleware
 * Catches all errors and returns standardized error responses.
 */

const mongoose = require('mongoose');
const { ApiError, logger } = require('../utils');
const config = require('../config');

/**
 * Convert various error types to ApiError
 * @param {Error} err - Original error
 * @returns {ApiError} Converted ApiError
 */
const convertError = (err) => {
    if (err instanceof ApiError) {
        return err;
    }

    // Mongoose validation error
    if (err instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(err.errors).map((e) => e.message);
        return ApiError.badRequest(`Validation error: ${messages.join(', ')}`);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err instanceof mongoose.Error.CastError) {
        return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return ApiError.conflict(`${field} already exists`);
    }

    // JWT errors (already handled in auth middleware, but just in case)
    if (err.name === 'JsonWebTokenError') {
        return ApiError.unauthorized('Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return ApiError.unauthorized('Token expired');
    }

    // Default to internal server error
    return ApiError.internal(err.message || 'Something went wrong');
};

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
    const apiError = convertError(err);

    // Log error
    if (apiError.statusCode >= 500) {
        logger.error('Server error:', {
            error: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });
    } else {
        logger.warn('Client error:', {
            error: apiError.message,
            statusCode: apiError.statusCode,
            path: req.path,
            method: req.method,
        });
    }

    // Build response
    const response = {
        success: false,
        status: apiError.status,
        message: apiError.message,
    };

    // Add stack trace in development
    if (config.env === 'development') {
        response.stack = err.stack;
    }

    res.status(apiError.statusCode).json(response);
};

/**
 * 404 Not Found handler for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
    next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
