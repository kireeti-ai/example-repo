/**
 * @fileoverview Task model schema
 * Defines the Task entity with status, priority, and assignments.
 * 
 * @module models/Task
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Task
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} taskNumber - Auto-generated task number (e.g., "PROJ-1")
 * @property {ObjectId} project - Reference to Project
 * @property {ObjectId} assignee - Reference to assigned User
 * @property {ObjectId} reporter - Reference to reporting User
 * @property {string} status - Task status
 * @property {string} priority - Task priority
 * @property {string} type - Task type
 * @property {ObjectId[]} labels - References to Labels
 * @property {Date} dueDate - Task due date
 * @property {number} estimatedHours - Estimated hours to complete
 * @property {number} actualHours - Actual hours spent
 * @property {ObjectId} parentTask - Reference to parent Task (for subtasks)
 * @property {number} order - Display order within status column
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: [200, 'Task title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
            default: '',
        },
        taskNumber: {
            type: String,
            unique: true,
            index: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Project is required'],
            index: true,
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Reporter is required'],
            index: true,
        },
        status: {
            type: String,
            enum: {
                values: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'],
                message: 'Invalid task status',
            },
            default: 'todo',
            index: true,
        },
        priority: {
            type: String,
            enum: {
                values: ['low', 'medium', 'high', 'urgent'],
                message: 'Priority must be low, medium, high, or urgent',
            },
            default: 'medium',
            index: true,
        },
        type: {
            type: String,
            enum: {
                values: ['task', 'bug', 'feature', 'improvement', 'epic', 'story'],
                message: 'Invalid task type',
            },
            default: 'task',
        },
        labels: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Label',
        }],
        dueDate: {
            type: Date,
            default: null,
            index: true,
        },
        estimatedHours: {
            type: Number,
            min: [0, 'Estimated hours cannot be negative'],
            default: null,
        },
        actualHours: {
            type: Number,
            min: [0, 'Actual hours cannot be negative'],
            default: 0,
        },
        parentTask: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            default: null,
        },
        order: {
            type: Number,
            default: 0,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

/**
 * Virtual for subtasks
 */
taskSchema.virtual('subtasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'parentTask',
});

/**
 * Virtual for comments count
 */
taskSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'task',
    count: true,
});

/**
 * Virtual to check if task is overdue
 */
taskSchema.virtual('isOverdue').get(function () {
    if (!this.dueDate || this.status === 'done' || this.status === 'cancelled') {
        return false;
    }
    return new Date() > this.dueDate;
});

/**
 * Pre-save hook to generate task number
 */
taskSchema.pre('save', async function (next) {
    if (this.isNew && !this.taskNumber) {
        const Project = mongoose.model('Project');
        const project = await Project.findById(this.project);

        if (project) {
            const count = await this.constructor.countDocuments({ project: this.project });
            this.taskNumber = `${project.key}-${count + 1}`;

            // Update project task count
            await Project.findByIdAndUpdate(this.project, {
                $inc: { taskCount: 1 },
            });
        }
    }

    // Track completion
    if (this.isModified('status')) {
        if (this.status === 'done' && !this.completedAt) {
            this.completedAt = new Date();
        } else if (this.status !== 'done') {
            this.completedAt = null;
        }
    }

    next();
});

/**
 * Post-save hook to update project completion count
 */
taskSchema.post('save', async function (doc) {
    if (doc.isModified && doc.isModified('status')) {
        const Project = mongoose.model('Project');
        const completedCount = await this.constructor.countDocuments({
            project: doc.project,
            status: 'done',
        });
        await Project.findByIdAndUpdate(doc.project, {
            completedTaskCount: completedCount,
        });
    }
});

// Compound indexes for common queries
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, assignee: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ project: 1, dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
