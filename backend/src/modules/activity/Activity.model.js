/**
 * @fileoverview Activity Log model schema
 * Tracks all user actions for audit and activity feeds.
 * 
 * @module models/Activity
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Activity
 * @property {string} action - Action type
 * @property {ObjectId} actor - Reference to User who performed the action
 * @property {string} entityType - Type of entity affected
 * @property {ObjectId} entityId - ID of affected entity
 * @property {ObjectId} project - Reference to Project (if applicable)
 * @property {Object} metadata - Additional action details
 * @property {Object} changes - Before/after values for updates
 * @property {string} ipAddress - IP address of the actor
 * @property {string} userAgent - User agent string
 * @property {Date} createdAt - Creation timestamp
 */

const activitySchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: [true, 'Action is required'],
            enum: {
                values: [
                    // Auth actions
                    'user.login',
                    'user.logout',
                    'user.register',
                    'user.password_change',

                    // User actions
                    'user.update',
                    'user.delete',
                    'user.role_change',

                    // Project actions
                    'project.create',
                    'project.update',
                    'project.delete',
                    'project.archive',
                    'project.member_add',
                    'project.member_remove',
                    'project.member_role_change',

                    // Task actions
                    'task.create',
                    'task.update',
                    'task.delete',
                    'task.status_change',
                    'task.assign',
                    'task.unassign',
                    'task.priority_change',
                    'task.label_add',
                    'task.label_remove',

                    // Comment actions
                    'comment.create',
                    'comment.update',
                    'comment.delete',
                    'comment.reaction_add',
                    'comment.reaction_remove',

                    // Label actions
                    'label.create',
                    'label.update',
                    'label.delete',
                ],
                message: 'Invalid action type',
            },
            index: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Actor is required'],
            index: true,
        },
        entityType: {
            type: String,
            required: [true, 'Entity type is required'],
            enum: ['user', 'project', 'task', 'comment', 'label'],
            index: true,
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Entity ID is required'],
            index: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
            index: true,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        changes: {
            before: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
            after: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// TTL index to automatically delete old activities (optional, 90 days)
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Compound indexes for common queries
activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ actor: 1, createdAt: -1 });
activitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });

/**
 * Static method to log an activity
 * @param {Object} data - Activity data
 * @returns {Promise<Activity>}
 */
activitySchema.statics.log = function (data) {
    return this.create(data);
};

/**
 * Static method to get activities for a project
 * @param {string} projectId - Project ID
 * @param {Object} options - Query options
 * @returns {Promise<Activity[]>}
 */
activitySchema.statics.getProjectActivities = function (projectId, options = {}) {
    const { limit = 50, skip = 0 } = options;

    return this.find({ project: projectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('actor', 'firstName lastName email avatar');
};

/**
 * Static method to get activities for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Activity[]>}
 */
activitySchema.statics.getUserActivities = function (userId, options = {}) {
    const { limit = 50, skip = 0 } = options;

    return this.find({ actor: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('actor', 'firstName lastName email avatar');
};

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
