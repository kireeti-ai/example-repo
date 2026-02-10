/**
 * @fileoverview Label routes
 * @swagger
 * tags:
 *   name: Labels
 *   description: Label management endpoints
 */

const express = require('express');
const labelController = require('../controllers/label.controller');
const { authenticate, authorizeMinRole, validate, ValidationSource, schemas, Roles } = require('../../../middleware');
const { createLabelSchema, updateLabelSchema, listLabelsQuerySchema } = require('../validators/label.validator');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/labels:
 *   get:
 *     tags: [Labels]
 *     summary: List labels
 *     operationId: listLabels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *       - in: query
 *         name: includeGlobal
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of labels
 */
router.get('/', validate(listLabelsQuerySchema, ValidationSource.QUERY), labelController.listLabels);

/**
 * @swagger
 * /api/v1/labels:
 *   post:
 *     tags: [Labels]
 *     summary: Create a label
 *     operationId: createLabel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLabelRequest'
 *     responses:
 *       201:
 *         description: Label created
 */
router.post('/', authorizeMinRole(Roles.MEMBER), validate(createLabelSchema), labelController.createLabel);

/**
 * @swagger
 * /api/v1/labels/{id}:
 *   get:
 *     tags: [Labels]
 *     summary: Get label by ID
 *     operationId: getLabelById
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
 *         description: Label details
 */
router.get('/:id', validate(schemas.idParam, ValidationSource.PARAMS), labelController.getLabelById);

/**
 * @swagger
 * /api/v1/labels/{id}:
 *   patch:
 *     tags: [Labels]
 *     summary: Update a label
 *     operationId: updateLabel
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
 *             $ref: '#/components/schemas/UpdateLabelRequest'
 *     responses:
 *       200:
 *         description: Label updated
 */
router.patch('/:id', validate(schemas.idParam, ValidationSource.PARAMS), validate(updateLabelSchema), labelController.updateLabel);

/**
 * @swagger
 * /api/v1/labels/{id}:
 *   delete:
 *     tags: [Labels]
 *     summary: Delete a label
 *     operationId: deleteLabel
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
 *         description: Label deleted
 */
router.delete('/:id', validate(schemas.idParam, ValidationSource.PARAMS), labelController.deleteLabel);

module.exports = router;
