/**
 * @fileoverview Search controller
 * Handles HTTP requests for global search endpoints.
 */

const searchService = require('../services/search.service');
const { ApiResponse, asyncHandler, ApiError } = require('../../../utils');

/**
 * @class SearchController
 * @description Controller for search endpoints
 */
class SearchController {
    /**
     * Global search across tasks, projects, users, and comments
     * @route GET /api/v1/search
     */
    globalSearch = asyncHandler(async (req, res) => {
        const { q, scope, limit } = req.query;

        if (!q || q.trim().length < 2) {
            throw ApiError.badRequest('Search query must be at least 2 characters');
        }

        const results = await searchService.globalSearch(
            q.trim(),
            { scope, limit: parseInt(limit, 10) || 10 },
            req.user.userId
        );

        ApiResponse.success(res, {
            data: results,
        });
    });
}

module.exports = new SearchController();
