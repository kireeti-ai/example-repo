/**
 * @fileoverview Task validation schemas
 * Joi validation schemas for task endpoints.
 */

const Joi = require('joi');

/**
 * Create task schema
 */
const createTaskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.min': 'Task title is required',
            'string.max': 'Task title cannot exceed 200 characters',
            'any.required': 'Task title is required',
        }),
    description: Joi.string()
        .trim()
        .max(5000)
        .allow('')
        .default(''),
    projectId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid project ID format',
            'any.required': 'Project ID is required',
        }),
    assigneeId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .allow(null)
        .messages({
            'string.pattern.base': 'Invalid assignee ID format',
        }),
    status: Joi.string()
        .valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled')
        .default('todo'),
    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent')
        .default('medium'),
    type: Joi.string()
        .valid('task', 'bug', 'feature', 'improvement', 'epic', 'story')
        .default('task'),
    labels: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .default([]),
    dueDate: Joi.date()
        .iso()
        .allow(null),
    estimatedHours: Joi.number()
        .min(0)
        .allow(null),
    parentTaskId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .allow(null),
});

/**
 * Update task schema
 */
const updateTaskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(200),
    description: Joi.string()
        .trim()
        .max(5000)
        .allow(''),
    assigneeId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .allow(null),
    status: Joi.string()
        .valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'),
    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent'),
    type: Joi.string()
        .valid('task', 'bug', 'feature', 'improvement', 'epic', 'story'),
    labels: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
    dueDate: Joi.date()
        .iso()
        .allow(null),
    estimatedHours: Joi.number()
        .min(0)
        .allow(null),
    actualHours: Joi.number()
        .min(0),
    order: Joi.number()
        .integer()
        .min(0),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

/**
 * List tasks query schema
 */
const listTasksQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'dueDate', 'priority', 'status', 'title', 'updatedAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    status: Joi.alternatives().try(
        Joi.string().valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'),
        Joi.array().items(Joi.string().valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'))
    ),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    assigneeId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    type: Joi.string().valid('task', 'bug', 'feature', 'improvement', 'epic', 'story'),
    search: Joi.string().trim().max(100),
    overdue: Joi.boolean(),
});

/**
 * Bulk update tasks schema
 */
const bulkUpdateTasksSchema = Joi.object({
    taskIds: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .max(50)
        .required(),
    updates: Joi.object({
        status: Joi.string()
            .valid('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'),
        priority: Joi.string()
            .valid('low', 'medium', 'high', 'urgent'),
        assigneeId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .allow(null),
    }).min(1).required(),
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    listTasksQuerySchema,
    bulkUpdateTasksSchema,
};
