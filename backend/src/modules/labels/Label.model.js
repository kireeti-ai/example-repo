/**
 * @fileoverview Label model schema
 * Defines the Label entity for categorizing tasks.
 * 
 * @module models/Label
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Label
 * @property {string} name - Label name
 * @property {string} color - Label color (hex code)
 * @property {string} description - Label description
 * @property {ObjectId} project - Reference to Project (null for global labels)
 * @property {ObjectId} createdBy - Reference to User who created the label
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const labelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Label name is required'],
            trim: true,
            maxlength: [50, 'Label name cannot exceed 50 characters'],
        },
        color: {
            type: String,
            required: [true, 'Label color is required'],
            match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code (e.g., #FF5733)'],
            default: '#6B7280',
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Description cannot exceed 200 characters'],
            default: '',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator is required'],
        },
        isArchived: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

/**
 * Virtual to check if label is global
 */
labelSchema.virtual('isGlobal').get(function () {
    return this.project === null;
});

/**
 * Virtual for task count using this label
 */
labelSchema.virtual('taskCount', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'labels',
    count: true,
});

// Compound indexes
labelSchema.index({ project: 1, name: 1 }, { unique: true });
labelSchema.index({ project: 1, isArchived: 1 });

const Label = mongoose.model('Label', labelSchema);

module.exports = Label;
