/**
 * @fileoverview Dashboard controller
 * Handles HTTP requests for dashboard analytics endpoints.
 */

const dashboardService = require('../services/dashboard.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

/**
 * @class DashboardController
 * @description Controller for dashboard endpoints
 */
class DashboardController {
    /**
     * Get user dashboard overview
     * @route GET /api/v1/dashboard/overview
     */
    getOverview = asyncHandler(async (req, res) => {
        const overview = await dashboardService.getDashboardOverview(req.user.userId);

        ApiResponse.success(res, {
            data: { overview },
        });
    });

    /**
     * Get admin system-wide dashboard
     * @route GET /api/v1/dashboard/admin
     */
    getAdminDashboard = asyncHandler(async (req, res) => {
        const dashboard = await dashboardService.getAdminDashboard();

        ApiResponse.success(res, {
            data: { dashboard },
        });
    });

    /**
     * Get workload distribution for a project
     * @route GET /api/v1/dashboard/workload/:projectId
     */
    getProjectWorkload = asyncHandler(async (req, res) => {
        const workload = await dashboardService.getProjectWorkload(req.params.projectId);

        ApiResponse.success(res, {
            data: { workload },
        });
    });
}

module.exports = new DashboardController();
