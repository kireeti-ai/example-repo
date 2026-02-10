/**
 * @fileoverview JWT token utilities
 * Handles generation and verification of access and refresh tokens.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * @typedef {Object} TokenPayload
 * @property {string} userId - User ID
 * @property {string} role - User role
 * @property {string} [type] - Token type
 */

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @param {string} payload.role - User role
 * @returns {string} JWT access token
 */
const generateAccessToken = ({ userId, role }) => {
    return jwt.sign(
        { userId, role, type: 'access' },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpiresIn }
    );
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = ({ userId }) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
    );
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @param {string} payload.role - User role
 * @returns {Object} Object containing both tokens
 */
const generateTokens = ({ userId, role }) => {
    return {
        accessToken: generateAccessToken({ userId, role }),
        refreshToken: generateRefreshToken({ userId }),
    };
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {TokenPayload} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
    }
    return decoded;
};

/**
 * Verify refresh token
 * @param {string} token - JWT token to verify
 * @returns {TokenPayload} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
    }
    return decoded;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
};
