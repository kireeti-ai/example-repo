/**
 * @fileoverview User validation schemas
 * Joi validation schemas for user endpoints.
 */

const Joi = require('joi');

/**
 * Update user profile schema
 */
const updateProfileSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .messages({
            'string.min': 'First name cannot be empty',
            'string.max': 'First name cannot exceed 50 characters',
        }),
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .messages({
            'string.min': 'Last name cannot be empty',
            'string.max': 'Last name cannot exceed 50 characters',
        }),
    avatar: Joi.string()
        .uri()
        .allow(null)
        .messages({
            'string.uri': 'Avatar must be a valid URL',
        }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * Update user role schema (admin only)
 */
const updateRoleSchema = Joi.object({
    role: Joi.string()
        .valid('admin', 'member', 'viewer')
        .required()
        .messages({
            'any.only': 'Role must be admin, member, or viewer',
            'any.required': 'Role is required',
        }),
});

/**
 * List users query schema
 */
const listUsersQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'email', 'firstName', 'lastName', 'role').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    role: Joi.string().valid('admin', 'member', 'viewer'),
    isActive: Joi.boolean(),
    search: Joi.string().trim().max(100),
});

module.exports = {
    updateProfileSchema,
    updateRoleSchema,
    listUsersQuerySchema,
};
