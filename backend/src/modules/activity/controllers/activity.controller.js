/**
 * @fileoverview Activity controller
 */

const activityService = require('../services/activity.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

class ActivityController {
    getProjectActivities = asyncHandler(async (req, res) => {
        const result = await activityService.getProjectActivities(req.params.projectId, req.query);
        ApiResponse.paginated(res, {
            data: result.activities,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    getUserActivities = asyncHandler(async (req, res) => {
        const result = await activityService.getUserActivities(req.params.userId, req.query);
        ApiResponse.paginated(res, {
            data: result.activities,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    getMyActivities = asyncHandler(async (req, res) => {
        const result = await activityService.getUserActivities(req.user.userId, req.query);
        ApiResponse.paginated(res, {
            data: result.activities,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });
}

module.exports = new ActivityController();
