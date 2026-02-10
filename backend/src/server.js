/**
 * @fileoverview Server entry point
 * Starts the Express server and connects to MongoDB.
 */

const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./config/database');
const logger = require('./utils/logger');

const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`Server running in ${config.env} mode on port ${config.port}`);
            logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
            logger.info(`Health check available at http://localhost:${config.port}/health`);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    const { disconnectDatabase } = require('./config/database');
                    await disconnectDatabase();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during graceful shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
