/**
 * @fileoverview Activity routes
 * @swagger
 * tags:
 *   name: Activity
 *   description: Activity log endpoints
 */

const express = require('express');
const activityController = require('../controllers/activity.controller');
const { authenticate } = require('../../../middleware');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/activities/me:
 *   get:
 *     tags: [Activity]
 *     summary: Get my activities
 *     operationId: getMyActivities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of activities
 */
router.get('/me', activityController.getMyActivities);

/**
 * @swagger
 * /api/v1/activities/project/{projectId}:
 *   get:
 *     tags: [Activity]
 *     summary: Get project activities
 *     operationId: getProjectActivities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of activities
 */
router.get('/project/:projectId', activityController.getProjectActivities);

/**
 * @swagger
 * /api/v1/activities/user/{userId}:
 *   get:
 *     tags: [Activity]
 *     summary: Get user activities
 *     operationId: getUserActivities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of activities
 */
router.get('/user/:userId', activityController.getUserActivities);

module.exports = router;
