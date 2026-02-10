/**
 * @fileoverview Project model schema
 * Defines the Project entity with team membership and settings.
 * 
 * @module models/Project
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} ProjectMember
 * @property {ObjectId} user - Reference to User
 * @property {string} role - Member's role in project (owner|admin|member|viewer)
 * @property {Date} joinedAt - When member joined the project
 */

/**
 * @typedef {Object} Project
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {string} key - Unique project key (e.g., "PROJ")
 * @property {ObjectId} owner - Reference to owning User
 * @property {ProjectMember[]} members - Array of project members
 * @property {string} status - Project status (active|archived|completed)
 * @property {string} visibility - Project visibility (private|public)
 * @property {Object} settings - Project settings
 * @property {Date} startDate - Project start date
 * @property {Date} endDate - Project end date
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const projectMemberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: {
                values: ['owner', 'admin', 'member', 'viewer'],
                message: 'Member role must be owner, admin, member, or viewer',
            },
            default: 'member',
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            maxlength: [100, 'Project name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
            default: '',
        },
        key: {
            type: String,
            required: [true, 'Project key is required'],
            unique: true,
            uppercase: true,
            trim: true,
            match: [/^[A-Z][A-Z0-9]{1,9}$/, 'Key must be 2-10 uppercase alphanumeric characters starting with a letter'],
            index: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Project owner is required'],
            index: true,
        },
        members: {
            type: [projectMemberSchema],
            default: [],
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'archived', 'completed'],
                message: 'Status must be active, archived, or completed',
            },
            default: 'active',
            index: true,
        },
        visibility: {
            type: String,
            enum: {
                values: ['private', 'public'],
                message: 'Visibility must be private or public',
            },
            default: 'private',
        },
        settings: {
            defaultTaskPriority: {
                type: String,
                enum: ['low', 'medium', 'high', 'urgent'],
                default: 'medium',
            },
            allowComments: {
                type: Boolean,
                default: true,
            },
            requireTaskDescription: {
                type: Boolean,
                default: false,
            },
        },
        startDate: {
            type: Date,
            default: null,
        },
        endDate: {
            type: Date,
            default: null,
        },
        taskCount: {
            type: Number,
            default: 0,
        },
        completedTaskCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

/**
 * Virtual for completion percentage
 */
projectSchema.virtual('completionPercentage').get(function () {
    if (this.taskCount === 0) return 0;
    return Math.round((this.completedTaskCount / this.taskCount) * 100);
});

/**
 * Check if user is a member of the project
 * @param {string} userId - User ID to check
 * @returns {boolean}
 */
projectSchema.methods.isMember = function (userId) {
    return (
        this.owner.toString() === userId.toString() ||
        this.members.some((m) => m.user.toString() === userId.toString())
    );
};

/**
 * Get member's role in the project
 * @param {string} userId - User ID to check
 * @returns {string|null} Member's role or null if not a member
 */
projectSchema.methods.getMemberRole = function (userId) {
    if (this.owner.toString() === userId.toString()) {
        return 'owner';
    }
    const member = this.members.find((m) => m.user.toString() === userId.toString());
    return member ? member.role : null;
};

// Compound indexes for common queries
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'members.user': 1, status: 1 });
projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
