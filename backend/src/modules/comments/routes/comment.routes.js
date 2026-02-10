/**
 * @fileoverview Comment routes
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */

const express = require('express');
const commentController = require('../controllers/comment.controller');
const { authenticate, validate, ValidationSource, schemas } = require('../../../middleware');
const {
    createCommentSchema,
    updateCommentSchema,
    addReactionSchema,
    listCommentsQuerySchema,
} = require('../validators/comment.validator');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/comments:
 *   get:
 *     tags: [Comments]
 *     summary: List comments for a task
 *     operationId: listComments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: taskId
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
 *         description: List of comments
 */
router.get('/', validate(listCommentsQuerySchema, ValidationSource.QUERY), commentController.listComments);

/**
 * @swagger
 * /api/v1/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     operationId: createComment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post('/', validate(createCommentSchema), commentController.createComment);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     summary: Update a comment
 *     operationId: updateComment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         description: Comment updated
 */
router.patch('/:id', validate(schemas.idParam, ValidationSource.PARAMS), validate(updateCommentSchema), commentController.updateComment);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     operationId: deleteComment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/:id', validate(schemas.idParam, ValidationSource.PARAMS), commentController.deleteComment);

/**
 * @swagger
 * /api/v1/comments/{id}/reactions:
 *   post:
 *     tags: [Comments]
 *     summary: Add reaction to comment
 *     operationId: addReaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emoji:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reaction added
 */
router.post('/:id/reactions', validate(schemas.idParam, ValidationSource.PARAMS), validate(addReactionSchema), commentController.addReaction);

/**
 * @swagger
 * /api/v1/comments/{id}/reactions/{emoji}:
 *   delete:
 *     tags: [Comments]
 *     summary: Remove reaction from comment
 *     operationId: removeReaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: emoji
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reaction removed
 */
router.delete('/:id/reactions/:emoji', commentController.removeReaction);

module.exports = router;
