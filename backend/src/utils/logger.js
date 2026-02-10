/**
 * @fileoverview Winston logger configuration
 * Provides structured logging with different levels and formats.
 */

const winston = require('winston');
const config = require('../config');

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for development
 */
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
        log += `\n${stack}`;
    }
    return log;
});

/**
 * Custom log format for production (JSON)
 */
const prodFormat = printf(({ level, message, timestamp, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
    });
});

/**
 * Logger instance
 */
const logger = winston.createLogger({
    level: config.logging.level,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true })
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                config.env === 'development' ? devFormat : prodFormat
            ),
        }),
    ],
});

// Add file transport for production
if (config.env === 'production') {
    logger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: prodFormat,
        })
    );
    logger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: prodFormat,
        })
    );
}

module.exports = logger;
