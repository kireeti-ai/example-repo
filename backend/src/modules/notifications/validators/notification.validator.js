/**
 * @fileoverview Notification validation schemas
 * Joi validation schemas for notification endpoints.
 */

const Joi = require('joi');

/**
 * List notifications query schema
 */
const listNotificationsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    isRead: Joi.boolean(),
    type: Joi.alternatives().try(
        Joi.string().valid(
            'task_assigned', 'task_unassigned', 'task_status_changed',
            'task_priority_changed', 'task_due_soon', 'task_overdue',
            'task_comment', 'task_mentioned', 'project_invited',
            'project_role_changed', 'project_removed', 'comment_reply',
            'comment_reaction', 'system_announcement'
        ),
        Joi.array().items(Joi.string().valid(
            'task_assigned', 'task_unassigned', 'task_status_changed',
            'task_priority_changed', 'task_due_soon', 'task_overdue',
            'task_comment', 'task_mentioned', 'project_invited',
            'project_role_changed', 'project_removed', 'comment_reply',
            'comment_reaction', 'system_announcement'
        ))
    ),
});

module.exports = {
    listNotificationsQuerySchema,
};
