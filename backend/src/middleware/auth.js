/**
 * @fileoverview Authentication middleware
 * Verifies JWT tokens and attaches user information to requests.
 */

const { ApiError, jwt: jwtUtils } = require('../utils');

/**
 * Authentication middleware
 * Verifies the access token from Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Access token is required');
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwtUtils.verifyAccessToken(token);
            req.user = {
                userId: decoded.userId,
                role: decoded.role,
            };
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.unauthorized('Access token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw ApiError.unauthorized('Invalid access token');
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwtUtils.verifyAccessToken(token);
                req.user = {
                    userId: decoded.userId,
                    role: decoded.role,
                };
            } catch (error) {
                // Token is invalid, but that's okay for optional auth
                req.user = null;
            }
        } else {
            req.user = null;
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticate,
    optionalAuth,
};
