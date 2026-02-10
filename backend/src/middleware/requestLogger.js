/**
 * @fileoverview Request logging middleware
 * Logs all incoming HTTP requests with relevant details.
 */

const morgan = require('morgan');
const { logger } = require('../utils');

/**
 * Custom Morgan token for request ID
 */
morgan.token('request-id', (req) => req.headers['x-request-id'] || '-');

/**
 * Custom Morgan token for user ID
 */
morgan.token('user-id', (req) => (req.user ? req.user.userId : 'anonymous'));

/**
 * Development logging format
 */
const devFormat = ':method :url :status :response-time ms - :res[content-length]';

/**
 * Production logging format (JSON-like)
 */
const prodFormat = JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time ms',
    contentLength: ':res[content-length]',
    requestId: ':request-id',
    userId: ':user-id',
    userAgent: ':user-agent',
});

/**
 * Morgan stream that uses Winston logger
 */
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

/**
 * Create request logger middleware
 * @param {string} environment - Current environment (development/production)
 * @returns {Function} Morgan middleware instance
 */
const requestLogger = (environment) => {
    const format = environment === 'development' ? devFormat : prodFormat;

    return morgan(format, {
        stream,
        skip: (req) => {
            // Skip logging for health checks in production
            if (environment === 'production' && req.url === '/health') {
                return true;
            }
            return false;
        },
    });
};

module.exports = requestLogger;
