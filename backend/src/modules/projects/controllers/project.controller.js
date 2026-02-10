/**
 * @fileoverview Project controller
 * Handles HTTP requests for project endpoints.
 */

const projectService = require('../services/project.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

/**
 * @class ProjectController
 * @description Controller for project endpoints
 */
class ProjectController {
    /**
     * Create a new project
     * @route POST /api/v1/projects
     */
    createProject = asyncHandler(async (req, res) => {
        const project = await projectService.createProject(req.body, req.user.userId);

        ApiResponse.created(res, {
            message: 'Project created successfully',
            data: { project },
        });
    });

    /**
     * Get project by ID
     * @route GET /api/v1/projects/:id
     */
    getProjectById = asyncHandler(async (req, res) => {
        const project = await projectService.getProjectById(
            req.params.id,
            req.user.userId
        );

        ApiResponse.success(res, {
            data: { project },
        });
    });

    /**
     * List projects
     * @route GET /api/v1/projects
     */
    listProjects = asyncHandler(async (req, res) => {
        const result = await projectService.listProjects(req.user.userId, req.query);

        ApiResponse.paginated(res, {
            data: result.projects,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    /**
     * Update project
     * @route PATCH /api/v1/projects/:id
     */
    updateProject = asyncHandler(async (req, res) => {
        const project = await projectService.updateProject(
            req.params.id,
            req.body,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Project updated successfully',
            data: { project },
        });
    });

    /**
     * Delete project
     * @route DELETE /api/v1/projects/:id
     */
    deleteProject = asyncHandler(async (req, res) => {
        await projectService.deleteProject(req.params.id, req.user.userId);

        ApiResponse.success(res, {
            message: 'Project deleted successfully',
        });
    });

    /**
     * Add member to project
     * @route POST /api/v1/projects/:id/members
     */
    addMember = asyncHandler(async (req, res) => {
        const project = await projectService.addMember(
            req.params.id,
            req.body,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Member added successfully',
            data: { project },
        });
    });

    /**
     * Remove member from project
     * @route DELETE /api/v1/projects/:id/members/:memberId
     */
    removeMember = asyncHandler(async (req, res) => {
        const project = await projectService.removeMember(
            req.params.id,
            req.params.memberId,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Member removed successfully',
            data: { project },
        });
    });

    /**
     * Update member role
     * @route PATCH /api/v1/projects/:id/members/:memberId
     */
    updateMemberRole = asyncHandler(async (req, res) => {
        const project = await projectService.updateMemberRole(
            req.params.id,
            req.params.memberId,
            req.body.role,
            req.user.userId
        );

        ApiResponse.success(res, {
            message: 'Member role updated successfully',
            data: { project },
        });
    });

    /**
     * Get project analytics
     * @route GET /api/v1/projects/analytics
     */
    getAnalytics = asyncHandler(async (req, res) => {
        const analytics = await projectService.getProjectAnalytics(req.query);

        ApiResponse.success(res, {
            data: { analytics },
        });
    });
}

module.exports = new ProjectController();
