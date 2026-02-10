/**
 * @fileoverview Comment model schema
 * Defines the Comment entity for task discussions.
 * 
 * @module models/Comment
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Comment
 * @property {string} content - Comment content
 * @property {ObjectId} task - Reference to Task
 * @property {ObjectId} author - Reference to User (comment author)
 * @property {ObjectId} parentComment - Reference to parent Comment (for replies)
 * @property {boolean} isEdited - Whether comment has been edited
 * @property {Date} editedAt - Last edit timestamp
 * @property {ObjectId[]} mentions - References to mentioned Users
 * @property {Object[]} reactions - Array of reactions
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

const reactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        emoji: {
            type: String,
            required: true,
            maxlength: 10,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Comment content is required'],
            trim: true,
            maxlength: [2000, 'Comment cannot exceed 2000 characters'],
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: [true, 'Task is required'],
            index: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required'],
            index: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
            index: true,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
            default: null,
        },
        mentions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        reactions: {
            type: [reactionSchema],
            default: [],
        },
        isDeleted: {
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
 * Virtual for replies
 */
commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
});

/**
 * Virtual for reply count
 */
commentSchema.virtual('replyCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
    count: true,
});

/**
 * Pre-save hook to track edits
 */
commentSchema.pre('save', function (next) {
    if (!this.isNew && this.isModified('content')) {
        this.isEdited = true;
        this.editedAt = new Date();
    }
    next();
});

/**
 * Add reaction to comment
 * @param {string} userId - User ID
 * @param {string} emoji - Reaction emoji
 * @returns {Promise<Comment>}
 */
commentSchema.methods.addReaction = function (userId, emoji) {
    const existingReaction = this.reactions.find(
        (r) => r.user.toString() === userId.toString() && r.emoji === emoji
    );

    if (!existingReaction) {
        this.reactions.push({ user: userId, emoji });
    }

    return this.save();
};

/**
 * Remove reaction from comment
 * @param {string} userId - User ID
 * @param {string} emoji - Reaction emoji
 * @returns {Promise<Comment>}
 */
commentSchema.methods.removeReaction = function (userId, emoji) {
    this.reactions = this.reactions.filter(
        (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
    );
    return this.save();
};

// Compound indexes for common queries
commentSchema.index({ task: 1, createdAt: -1 });
commentSchema.index({ task: 1, parentComment: 1 });
commentSchema.index({ author: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
