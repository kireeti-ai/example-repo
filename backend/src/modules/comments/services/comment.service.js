/**
 * @fileoverview Comment service
 */

const Comment = require('../Comment.model');
const Task = require('../../tasks/Task.model');
const Activity = require('../../activity/Activity.model');
const { ApiError } = require('../../../utils');

class CommentService {
    async createComment(commentData, authorId) {
        const { taskId, parentCommentId, ...rest } = commentData;

        const task = await Task.findById(taskId);
        if (!task) {
            throw ApiError.notFound('Task not found');
        }

        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment || parentComment.task.toString() !== taskId) {
                throw ApiError.notFound('Parent comment not found');
            }
        }

        const comment = await Comment.create({
            ...rest,
            task: taskId,
            author: authorId,
            parentComment: parentCommentId || null,
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'firstName lastName email avatar')
            .populate('mentions', 'firstName lastName email');

        await Activity.log({
            action: 'comment.create',
            actor: authorId,
            entityType: 'comment',
            entityId: comment._id,
            project: task.project,
            metadata: { taskNumber: task.taskNumber },
        });

        return populatedComment.toJSON();
    }

    async listComments(options = {}) {
        const { taskId, page = 1, limit = 20 } = options;
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find({ task: taskId, parentComment: null, isDeleted: false })
                .populate('author', 'firstName lastName email avatar')
                .populate('mentions', 'firstName lastName email')
                .populate({
                    path: 'replies',
                    match: { isDeleted: false },
                    populate: { path: 'author', select: 'firstName lastName email avatar' },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Comment.countDocuments({ task: taskId, parentComment: null, isDeleted: false }),
        ]);

        return { comments: comments.map(c => c.toJSON()), total, page, limit };
    }

    async updateComment(commentId, content, userId) {
        const comment = await Comment.findById(commentId);
        if (!comment || comment.isDeleted) {
            throw ApiError.notFound('Comment not found');
        }
        if (comment.author.toString() !== userId) {
            throw ApiError.forbidden('You can only edit your own comments');
        }

        comment.content = content;
        await comment.save();

        return comment.toJSON();
    }

    async deleteComment(commentId, userId) {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw ApiError.notFound('Comment not found');
        }
        if (comment.author.toString() !== userId) {
            throw ApiError.forbidden('You can only delete your own comments');
        }

        comment.isDeleted = true;
        comment.content = '[Deleted]';
        await comment.save();
    }

    async addReaction(commentId, userId, emoji) {
        const comment = await Comment.findById(commentId);
        if (!comment || comment.isDeleted) {
            throw ApiError.notFound('Comment not found');
        }
        await comment.addReaction(userId, emoji);
        return comment.toJSON();
    }

    async removeReaction(commentId, userId, emoji) {
        const comment = await Comment.findById(commentId);
        if (!comment || comment.isDeleted) {
            throw ApiError.notFound('Comment not found');
        }
        await comment.removeReaction(userId, emoji);
        return comment.toJSON();
    }
}

module.exports = new CommentService();
