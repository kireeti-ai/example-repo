/**
 * @fileoverview Comment validation schemas
 */

const Joi = require('joi');

const createCommentSchema = Joi.object({
    content: Joi.string().trim().min(1).max(2000).required(),
    taskId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    parentCommentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null),
    mentions: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).default([]),
});

const updateCommentSchema = Joi.object({
    content: Joi.string().trim().min(1).max(2000).required(),
});

const addReactionSchema = Joi.object({
    emoji: Joi.string().max(10).required(),
});

const listCommentsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    taskId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports = {
    createCommentSchema,
    updateCommentSchema,
    addReactionSchema,
    listCommentsQuerySchema,
};
