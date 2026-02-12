/**
 * @fileoverview Search routes
 * Defines global search API routes.
 * 
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search endpoints
 */

const express = require('express');
const searchController = require('../controllers/search.controller');
const { authenticate, validate, ValidationSource } = require('../../../middleware');
const { globalSearchQuerySchema } = require('../validators/search.validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     tags: [Search]
 *     summary: Global search
 *     description: Search across tasks, projects, users, and comments. Results are grouped by entity type with configurable scope and limits.
 *     operationId: globalSearch
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         description: Search query (minimum 2 characters)
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [all, tasks, projects, users, comments]
 *           default: all
 *         description: Limit search to a specific entity type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum results per entity type
 *     responses:
 *       200:
 *         description: Search results grouped by entity type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                     totalCount:
 *                       type: integer
 *                     results:
 *                       type: object
 *                       properties:
 *                         tasks:
 *                           type: array
 *                         projects:
 *                           type: array
 *                         users:
 *                           type: array
 *                         comments:
 *                           type: array
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
    '/',
    validate(globalSearchQuerySchema, ValidationSource.QUERY),
    searchController.globalSearch
);

module.exports = router;
