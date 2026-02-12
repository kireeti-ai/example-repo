/**
 * @fileoverview Notification model schema
 * Defines the Notification entity for tracking user notifications.
 * 
 * @module models/Notification
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Notification
 * @property {ObjectId} recipient - User who receives the notification
 * @property {ObjectId} sender - User who triggered the notification
 * @property {string} type - Notification type
 * @property {string} title - Notification title
 * @property {string} message - Notification message body
 * @property {string} entityType - Type of related entity (task, project, comment)
 * @property {ObjectId} entityId - ID of the related entity
 * @property {ObjectId} project - Related project (optional)
 * @property {boolean} isRead - Whether the notification has been read
 * @property {Date} readAt - When the notification was read
 * @property {Object} metadata - Additional metadata
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Recipient is required'],
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        type: {
            type: String,
            enum: {
                values: [
                    'task_assigned',
                    'task_unassigned',
                    'task_status_changed',
                    'task_priority_changed',
                    'task_due_soon',
                    'task_overdue',
                    'task_comment',
                    'task_mentioned',
                    'project_invited',
                    'project_role_changed',
                    'project_removed',
                    'comment_reply',
                    'comment_reaction',
                    'system_announcement',
                ],
                message: 'Invalid notification type',
            },
            required: [true, 'Notification type is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Notification title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        message: {
            type: String,
            trim: true,
            maxlength: [500, 'Message cannot exceed 500 characters'],
            default: '',
        },
        entityType: {
            type: String,
            enum: ['task', 'project', 'comment', 'user', 'system'],
            default: null,
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
            default: null,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

/**
 * Static method to create a notification
 * @param {Object} data - Notification data
 * @returns {Promise<Notification>}
 */
notificationSchema.statics.notify = async function (data) {
    // Don't notify yourself
    if (data.sender && data.recipient &&
        data.sender.toString() === data.recipient.toString()) {
        return null;
    }
    return this.create(data);
};

/**
 * Static method to create bulk notifications
 * @param {string[]} recipientIds - Array of recipient user IDs
 * @param {Object} data - Notification data (without recipient)
 * @returns {Promise<Notification[]>}
 */
notificationSchema.statics.notifyMany = async function (recipientIds, data) {
    const notifications = recipientIds
        .filter((id) => !data.sender || id.toString() !== data.sender.toString())
        .map((recipientId) => ({
            ...data,
            recipient: recipientId,
        }));

    if (notifications.length === 0) return [];
    return this.insertMany(notifications);
};

// Compound indexes for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // TTL: 90 days

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
