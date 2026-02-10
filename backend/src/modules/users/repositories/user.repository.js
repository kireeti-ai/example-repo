/**
 * @fileoverview User repository
 * Data access layer for user operations.
 */

const User = require('../User.model');

/**
 * @class UserRepository
 * @description Data access methods for User model
 */
class UserRepository {
    /**
     * Find user by ID
     * @param {string} id - User ID
     * @param {Object} [options] - Query options
     * @returns {Promise<User|null>}
     */
    async findById(id, options = {}) {
        let query = User.findById(id);

        if (options.select) {
            query = query.select(options.select);
        }

        return query.exec();
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        return User.findOne({ email: email.toLowerCase() });
    }

    /**
     * Find users with pagination and filtering
     * @param {Object} options - Query options
     * @returns {Promise<{users: User[], total: number}>}
     */
    async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            role,
            isActive,
            search,
        } = options;

        const filter = {};

        if (role) {
            filter.role = role;
        }

        if (typeof isActive === 'boolean') {
            filter.isActive = isActive;
        }

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        return { users, total };
    }

    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async create(userData) {
        return User.create(userData);
    }

    /**
     * Update user by ID
     * @param {string} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<User|null>}
     */
    async updateById(id, updateData) {
        return User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    /**
     * Delete user by ID (soft delete)
     * @param {string} id - User ID
     * @returns {Promise<User|null>}
     */
    async softDelete(id) {
        return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    /**
     * Delete user by ID (hard delete)
     * @param {string} id - User ID
     * @returns {Promise<User|null>}
     */
    async deleteById(id) {
        return User.findByIdAndDelete(id);
    }

    /**
     * Count users by role
     * @returns {Promise<Object>}
     */
    async countByRole() {
        const result = await User.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    }
}

module.exports = new UserRepository();
