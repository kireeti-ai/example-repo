/**
 * @fileoverview User routes
 * Defines user API routes with validation and authorization.
 * 
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

const express = require('express');
const userController = require('../controllers/user.controller');
const {
    authenticate,
    authorize,
    authorizeOwnerOrAdmin,
    validate,
    ValidationSource,
    schemas,
    Roles,
} = require('../../../middleware');
const {
    updateProfileSchema,
    updateRoleSchema,
    listUsersQuerySchema,
} = require('../validators/user.validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/users/statistics:
 *   get:
 *     tags: [Users]
 *     summary: Get user statistics
 *     description: Get aggregate statistics about users (admin only)
 *     operationId: getUserStatistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatisticsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
    '/statistics',
    authorize(Roles.ADMIN),
    userController.getStatistics
);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     description: Get a paginated list of users
 *     operationId: listUsers
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
 *           enum: [createdAt, email, firstName, lastName, role]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, member, viewer]
 *         description: Filter by role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and email
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/',
    validate(listUsersQuerySchema, ValidationSource.QUERY),
    userController.listUsers
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Get a specific user's details
 *     operationId: getUserById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    userController.getUserById
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user profile
 *     description: Update user's profile (own profile or admin)
 *     operationId: updateUserProfile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           example:
 *             firstName: John
 *             lastName: Smith
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
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
    authorizeOwnerOrAdmin((req) => req.params.id),
    validate(updateProfileSchema),
    userController.updateProfile
);

/**
 * @swagger
 * /api/v1/users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Update user role
 *     description: Change a user's role (admin only)
 *     operationId: updateUserRole
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *           example:
 *             role: member
 *     responses:
 *       200:
 *         description: Role updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
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
    '/:id/role',
    validate(schemas.idParam, ValidationSource.PARAMS),
    authorize(Roles.ADMIN),
    validate(updateRoleSchema),
    userController.updateRole
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Deactivate user
 *     description: Deactivate a user account (admin only)
 *     operationId: deactivateUser
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
    '/:id',
    validate(schemas.idParam, ValidationSource.PARAMS),
    authorize(Roles.ADMIN),
    userController.deactivateUser
);

module.exports = router;
