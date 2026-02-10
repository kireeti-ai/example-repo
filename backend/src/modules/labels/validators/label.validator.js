/**
 * @fileoverview Label validation schemas
 */

const Joi = require('joi');

const createLabelSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50).required(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#6B7280'),
    description: Joi.string().trim().max(200).allow('').default(''),
    projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null),
});

const updateLabelSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    description: Joi.string().trim().max(200).allow(''),
}).min(1);

const listLabelsQuerySchema = Joi.object({
    projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    includeGlobal: Joi.boolean().default(true),
});

module.exports = {
    createLabelSchema,
    updateLabelSchema,
    listLabelsQuerySchema,
};
