/**
 * @fileoverview Auth service
 * Business logic for authentication operations.
 */

const bcrypt = require('bcryptjs');
const User = require('../../users/User.model');
const Activity = require('../../activity/Activity.model');
const { ApiError, jwt: jwtUtils } = require('../../../utils');

/**
 * @class AuthService
 * @description Handles authentication business logic
 */
class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User email
     * @param {string} userData.password - User password
     * @param {string} userData.firstName - User first name
     * @param {string} userData.lastName - User last name
     * @returns {Promise<{user: Object, tokens: Object}>}
     * @throws {ApiError} If email already exists
     */
    async register(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw ApiError.conflict('Email already registered');
        }

        const user = await User.create(userData);
        const tokens = jwtUtils.generateTokens({
            userId: user._id.toString(),
            role: user.role,
        });

        // Store refresh token hash
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        user.refreshToken = refreshTokenHash;
        await user.save();

        // Log activity
        await Activity.log({
            action: 'user.register',
            actor: user._id,
            entityType: 'user',
            entityId: user._id,
        });

        return {
            user: user.toJSON(),
            tokens,
        };
    }

    /**
     * Login user with email and password
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @param {Object} [requestInfo] - Request information for logging
     * @returns {Promise<{user: Object, tokens: Object}>}
     * @throws {ApiError} If credentials are invalid
     */
    async login({ email, password }, requestInfo = {}) {
        const user = await User.findOne({ email, isActive: true }).select('+password');

        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        const tokens = jwtUtils.generateTokens({
            userId: user._id.toString(),
            role: user.role,
        });

        // Store refresh token hash
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
        user.refreshToken = refreshTokenHash;
        user.lastLoginAt = new Date();
        await user.save();

        // Log activity
        await Activity.log({
            action: 'user.login',
            actor: user._id,
            entityType: 'user',
            entityId: user._id,
            ipAddress: requestInfo.ipAddress,
            userAgent: requestInfo.userAgent,
        });

        return {
            user: user.toJSON(),
            tokens,
        };
    }

    /**
     * Logout user by invalidating refresh token
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async logout(userId) {
        await User.findByIdAndUpdate(userId, { refreshToken: null });

        // Log activity
        await Activity.log({
            action: 'user.logout',
            actor: userId,
            entityType: 'user',
            entityId: userId,
        });
    }

    /**
     * Refresh access token using refresh token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     * @throws {ApiError} If refresh token is invalid
     */
    async refreshTokens(refreshToken) {
        try {
            const decoded = jwtUtils.verifyRefreshToken(refreshToken);
            const user = await User.findById(decoded.userId).select('+refreshToken');

            if (!user || !user.isActive) {
                throw ApiError.unauthorized('Invalid refresh token');
            }

            // Verify refresh token matches stored hash
            if (!user.refreshToken) {
                throw ApiError.unauthorized('Refresh token has been revoked');
            }

            const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isTokenValid) {
                throw ApiError.unauthorized('Invalid refresh token');
            }

            // Generate new tokens
            const tokens = jwtUtils.generateTokens({
                userId: user._id.toString(),
                role: user.role,
            });

            // Store new refresh token hash
            const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
            user.refreshToken = refreshTokenHash;
            await user.save();

            return tokens;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.unauthorized('Invalid refresh token');
        }
    }

    /**
     * Change user password
     * @param {string} userId - User ID
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<void>}
     * @throws {ApiError} If current password is incorrect
     */
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw ApiError.badRequest('Current password is incorrect');
        }

        user.password = newPassword;
        user.refreshToken = null; // Invalidate all sessions
        await user.save();

        // Log activity
        await Activity.log({
            action: 'user.password_change',
            actor: userId,
            entityType: 'user',
            entityId: userId,
        });
    }

    /**
     * Get current user profile
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     * @throws {ApiError} If user not found
     */
    async getCurrentUser(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user.toJSON();
    }
}

module.exports = new AuthService();
