/**
 * @fileoverview Application configuration module
 * Centralizes all environment variable access and provides sensible defaults.
 * All secrets must be provided via environment variables - no hardcoded values.
 */

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5001,

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task_team_management',
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

/**
 * Validates required configuration values
 * @throws {Error} If required configuration is missing
 */
const validateConfig = () => {
  const requiredSecrets = ['jwt.accessSecret', 'jwt.refreshSecret'];
  const missing = [];

  if (!config.jwt.accessSecret) missing.push('JWT_ACCESS_SECRET');
  if (!config.jwt.refreshSecret) missing.push('JWT_REFRESH_SECRET');

  if (missing.length > 0 && config.env !== 'test') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Use test secrets for testing environment
  if (config.env === 'test') {
    config.jwt.accessSecret = config.jwt.accessSecret || 'test-access-secret-key-for-testing-purposes-only';
    config.jwt.refreshSecret = config.jwt.refreshSecret || 'test-refresh-secret-key-for-testing-purposes-only';
  }
};

validateConfig();

module.exports = config;
