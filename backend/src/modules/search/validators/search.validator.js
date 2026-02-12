/**
 * @fileoverview Search validation schemas
 * Joi validation schemas for search endpoints.
 */

const Joi = require('joi');

/**
 * Global search query schema
 */
const globalSearchQuerySchema = Joi.object({
    q: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Search query must be at least 2 characters',
            'string.max': 'Search query cannot exceed 100 characters',
            'any.required': 'Search query is required',
        }),
    scope: Joi.string()
        .valid('all', 'tasks', 'projects', 'users', 'comments')
        .default('all'),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),
});

module.exports = {
    globalSearchQuerySchema,
};
