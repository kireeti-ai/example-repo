/**
 * @fileoverview Project validation schemas
 * Joi validation schemas for project endpoints.
 */

const Joi = require('joi');

/**
 * Create project schema
 */
const createProjectSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.min': 'Project name is required',
            'string.max': 'Project name cannot exceed 100 characters',
            'any.required': 'Project name is required',
        }),
    description: Joi.string()
        .trim()
        .max(1000)
        .allow('')
        .default('')
        .messages({
            'string.max': 'Description cannot exceed 1000 characters',
        }),
    key: Joi.string()
        .trim()
        .uppercase()
        .pattern(/^[A-Z][A-Z0-9]{1,9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Key must be 2-10 uppercase alphanumeric characters starting with a letter',
            'any.required': 'Project key is required',
        }),
    visibility: Joi.string()
        .valid('private', 'public')
        .default('private'),
    startDate: Joi.date()
        .iso()
        .allow(null),
    endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .allow(null)
        .messages({
            'date.min': 'End date must be after start date',
        }),
});

/**
 * Update project schema
 */
const updateProjectSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .messages({
            'string.min': 'Project name cannot be empty',
            'string.max': 'Project name cannot exceed 100 characters',
        }),
    description: Joi.string()
        .trim()
        .max(1000)
        .allow(''),
    visibility: Joi.string()
        .valid('private', 'public'),
    status: Joi.string()
        .valid('active', 'archived', 'completed'),
    startDate: Joi.date()
        .iso()
        .allow(null),
    endDate: Joi.date()
        .iso()
        .allow(null),
    settings: Joi.object({
        defaultTaskPriority: Joi.string()
            .valid('low', 'medium', 'high', 'urgent'),
        allowComments: Joi.boolean(),
        requireTaskDescription: Joi.boolean(),
    }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * Add member schema
 */
const addMemberSchema = Joi.object({
    userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format',
            'any.required': 'User ID is required',
        }),
    role: Joi.string()
        .valid('admin', 'member', 'viewer')
        .default('member'),
});

/**
 * Update member role schema
 */
const updateMemberRoleSchema = Joi.object({
    role: Joi.string()
        .valid('admin', 'member', 'viewer')
        .required()
        .messages({
            'any.only': 'Role must be admin, member, or viewer',
            'any.required': 'Role is required',
        }),
});

/**
 * List projects query schema
 */
const listProjectsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'name', 'status', 'updatedAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('active', 'archived', 'completed'),
    visibility: Joi.string().valid('private', 'public'),
    search: Joi.string().trim().max(100),
});

module.exports = {
    createProjectSchema,
    updateProjectSchema,
    addMemberSchema,
    updateMemberRoleSchema,
    listProjectsQuerySchema,
};
