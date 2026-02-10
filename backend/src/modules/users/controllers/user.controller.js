/**
 * @fileoverview User controller
 * Handles HTTP requests for user endpoints.
 */

const userService = require('../services/user.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

/**
 * @class UserController
 * @description Controller for user endpoints
 */
class UserController {
    /**
     * Get user by ID
     * @route GET /api/v1/users/:id
     */
    getUserById = asyncHandler(async (req, res) => {
        const user = await userService.getUserById(req.params.id);

        ApiResponse.success(res, {
            data: { user },
        });
    });

    /**
     * List all users
     * @route GET /api/v1/users
     */
    listUsers = asyncHandler(async (req, res) => {
        const result = await userService.listUsers(req.query);

        ApiResponse.paginated(res, {
            data: result.users,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    /**
     * Update user profile
     * @route PATCH /api/v1/users/:id
     */
    updateProfile = asyncHandler(async (req, res) => {
        const user = await userService.updateProfile(
            req.params.id,
            req.body,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Profile updated successfully',
            data: { user },
        });
    });

    /**
     * Update user role
     * @route PATCH /api/v1/users/:id/role
     */
    updateRole = asyncHandler(async (req, res) => {
        const user = await userService.updateRole(
            req.params.id,
            req.body.role,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Role updated successfully',
            data: { user },
        });
    });

    /**
     * Deactivate user
     * @route DELETE /api/v1/users/:id
     */
    deactivateUser = asyncHandler(async (req, res) => {
        await userService.deactivateUser(req.params.id, req.user.userId);

        ApiResponse.success(res, {
            message: 'User deactivated successfully',
        });
    });

    /**
     * Get user statistics
     * @route GET /api/v1/users/statistics
     */
    getStatistics = asyncHandler(async (req, res) => {
        const statistics = await userService.getStatistics();

        ApiResponse.success(res, {
            data: { statistics },
        });
    });
}

module.exports = new UserController();
