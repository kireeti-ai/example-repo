/**
 * @fileoverview Auth controller
 * Handles HTTP requests for authentication endpoints.
 */

const authService = require('../services/auth.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

/**
 * @class AuthController
 * @description Controller for authentication endpoints
 */
class AuthController {
    /**
     * Register a new user
     * @route POST /api/v1/auth/register
     */
    register = asyncHandler(async (req, res) => {
        const { user, tokens } = await authService.register(req.body);

        ApiResponse.created(res, {
            message: 'User registered successfully',
            data: {
                user,
                tokens,
            },
        });
    });

    /**
     * Login user
     * @route POST /api/v1/auth/login
     */
    login = asyncHandler(async (req, res) => {
        const requestInfo = {
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        };

        const { user, tokens } = await authService.login(req.body, requestInfo);

        ApiResponse.success(res, {
            message: 'Login successful',
            data: {
                user,
                tokens,
            },
        });
    });

    /**
     * Logout user
     * @route POST /api/v1/auth/logout
     */
    logout = asyncHandler(async (req, res) => {
        await authService.logout(req.user.userId);

        ApiResponse.success(res, {
            message: 'Logout successful',
        });
    });

    /**
     * Refresh access token
     * @route POST /api/v1/auth/refresh
     */
    refreshToken = asyncHandler(async (req, res) => {
        const tokens = await authService.refreshTokens(req.body.refreshToken);

        ApiResponse.success(res, {
            message: 'Tokens refreshed successfully',
            data: { tokens },
        });
    });

    /**
     * Change user password
     * @route POST /api/v1/auth/change-password
     */
    changePassword = asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        await authService.changePassword(req.user.userId, currentPassword, newPassword);

        ApiResponse.success(res, {
            message: 'Password changed successfully',
        });
    });

    /**
     * Get current user profile
     * @route GET /api/v1/auth/me
     */
    getCurrentUser = asyncHandler(async (req, res) => {
        const user = await authService.getCurrentUser(req.user.userId);

        ApiResponse.success(res, {
            data: { user },
        });
    });
}

module.exports = new AuthController();
