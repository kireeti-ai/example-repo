/**
 * @fileoverview MongoDB database connection configuration
 * Handles connection, disconnection, and connection events.
 */

const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} Mongoose connection instance
 */
const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(config.mongodb.uri, {
            // Mongoose 8.x uses these options by default
        });

        logger.info(`MongoDB connected: ${connection.connection.host}`);

        // Connection event handlers
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        return connection;
    } catch (error) {
        logger.error('MongoDB connection failed:', error);
        throw error;
    }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected successfully');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
};

module.exports = {
    connectDatabase,
    disconnectDatabase,
};
