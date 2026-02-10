/**
 * @fileoverview User service
 * Business logic for user operations.
 */

const userRepository = require('../repositories/user.repository');
const Activity = require('../../activity/Activity.model');
const { ApiError } = require('../../../utils');

/**
 * @class UserService
 * @description Handles user business logic
 */
class UserService {
    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     * @throws {ApiError} If user not found
     */
    async getUserById(userId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user.toJSON();
    }

    /**
     * List all users with pagination and filtering
     * @param {Object} options - Query options
     * @returns {Promise<{users: Object[], total: number, page: number, limit: number}>}
     */
    async listUsers(options = {}) {
        const { users, total } = await userRepository.findAll(options);

        return {
            users: users.map((user) => user.toJSON()),
            total,
            page: options.page || 1,
            limit: options.limit || 10,
        };
    }

    /**
     * Update user profile
     * @param {string} userId - User ID
     * @param {Object} updateData - Profile data to update
     * @param {string} actorId - ID of user performing the update
     * @returns {Promise<Object>}
     * @throws {ApiError} If user not found
     */
    async updateProfile(userId, updateData, actorId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        const beforeData = {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
        };

        const updatedUser = await userRepository.updateById(userId, updateData);

        // Log activity
        await Activity.log({
            action: 'user.update',
            actor: actorId,
            entityType: 'user',
            entityId: userId,
            changes: {
                before: beforeData,
                after: updateData,
            },
        });

        return updatedUser.toJSON();
    }

    /**
     * Update user role (admin only)
     * @param {string} userId - User ID
     * @param {string} newRole - New role
     * @param {string} actorId - ID of admin performing the update
     * @returns {Promise<Object>}
     * @throws {ApiError} If user not found or trying to demote last admin
     */
    async updateRole(userId, newRole, actorId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Prevent demoting the last admin
        if (user.role === 'admin' && newRole !== 'admin') {
            const roleCounts = await userRepository.countByRole();
            if (roleCounts.admin <= 1) {
                throw ApiError.badRequest('Cannot demote the last admin user');
            }
        }

        const beforeRole = user.role;
        const updatedUser = await userRepository.updateById(userId, { role: newRole });

        // Log activity
        await Activity.log({
            action: 'user.role_change',
            actor: actorId,
            entityType: 'user',
            entityId: userId,
            changes: {
                before: { role: beforeRole },
                after: { role: newRole },
            },
        });

        return updatedUser.toJSON();
    }

    /**
     * Deactivate user account
     * @param {string} userId - User ID
     * @param {string} actorId - ID of user performing the action
     * @returns {Promise<void>}
     * @throws {ApiError} If user not found or trying to deactivate last admin
     */
    async deactivateUser(userId, actorId) {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Prevent deactivating the last admin
        if (user.role === 'admin') {
            const roleCounts = await userRepository.countByRole();
            if (roleCounts.admin <= 1) {
                throw ApiError.badRequest('Cannot deactivate the last admin user');
            }
        }

        await userRepository.softDelete(userId);

        // Log activity
        await Activity.log({
            action: 'user.delete',
            actor: actorId,
            entityType: 'user',
            entityId: userId,
        });
    }

    /**
     * Get user statistics
     * @returns {Promise<Object>}
     */
    async getStatistics() {
        const roleCounts = await userRepository.countByRole();
        const { total } = await userRepository.findAll({ limit: 1 });

        return {
            total,
            byRole: roleCounts,
        };
    }
}

module.exports = new UserService();
