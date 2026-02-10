/**
 * @fileoverview Project routes
 * Defines project API routes with validation and authorization.
 * 
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

const express = require('express');
const projectController = require('../controllers/project.controller');
const {
    authenticate,
    authorizeMinRole,
    validate,
    ValidationSource,
    schemas,
    Roles,
} = require('../../../middleware');
const {
    createProjectSchema,
    updateProjectSchema,
    addMemberSchema,
    updateMemberRoleSchema,
    listProjectsQuerySchema,
} = require('../validators/project.validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/projects/analytics:
 *   get:
 *     tags: [Projects]
 *     summary: Get project analytics
 *     description: Get analytics data for active projects (aggregation endpoint)
 *     operationId: getProjectAnalytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of projects to return
 *     responses:
 *       200:
 *         description: Project analytics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectAnalyticsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/analytics',
    authorizeMinRole(Roles.MEMBER),
    projectController.getAnalytics
);

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects
 *     description: Get a paginated list of projects accessible to the user
 *     operationId: listProjects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name, status, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, archived, completed]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, and key
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectsListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/',
    validate(listProjectsQuerySchema, ValidationSource.QUERY),
    projectController.listProjects
);

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create project
 *     description: Create a new project
 *     operationId: createProject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *           example:
 *             name: My Awesome Project
 *             description: A project for tracking awesome tasks
 *             key: AWESOME
 *             visibility: private
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post(
    '/',
    authorizeMinRole(Roles.MEMBER),
    validate(createProjectSchema),
    projectController.createProject
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
 *     description: Get details of a specific project
 *     operationId: getProjectById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    projectController.getProjectById
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   patch:
 *     tags: [Projects]
 *     summary: Update project
 *     description: Update project details (owner or admin only)
 *     operationId: updateProject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *           example:
 *             name: Updated Project Name
 *             status: active
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    validate(updateProjectSchema),
    projectController.updateProject
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project
 *     description: Delete a project (owner only)
 *     operationId: deleteProject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    projectController.deleteProject
);

/**
 * @swagger
 * /api/v1/projects/{id}/members:
 *   post:
 *     tags: [Projects]
 *     summary: Add member to project
 *     description: Add a new member to the project (owner or admin only)
 *     operationId: addProjectMember
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddMemberRequest'
 *           example:
 *             userId: 507f1f77bcf86cd799439011
 *             role: member
 *     responses:
 *       200:
 *         description: Member added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post(
    '/:id/members',
    validate(schemas.idParam, ValidationSource.PARAMS),
    validate(addMemberSchema),
    projectController.addMember
);

/**
 * @swagger
 * /api/v1/projects/{id}/members/{memberId}:
 *   patch:
 *     tags: [Projects]
 *     summary: Update member role
 *     description: Update a member's role in the project (owner only)
 *     operationId: updateProjectMemberRole
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member's user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberRoleRequest'
 *           example:
 *             role: admin
 *     responses:
 *       200:
 *         description: Member role updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
    '/:id/members/:memberId',
    validate(updateMemberRoleSchema),
    projectController.updateMemberRole
);

/**
 * @swagger
 * /api/v1/projects/{id}/members/{memberId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Remove member from project
 *     description: Remove a member from the project (owner, admin, or self-removal)
 *     operationId: removeProjectMember
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member's user ID
 *     responses:
 *       200:
 *         description: Member removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
    '/:id/members/:memberId',
    projectController.removeMember
);

module.exports = router;
