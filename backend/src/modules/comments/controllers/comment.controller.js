/**
 * @fileoverview Comment controller
 */

const commentService = require('../services/comment.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

class CommentController {
    createComment = asyncHandler(async (req, res) => {
        const comment = await commentService.createComment(req.body, req.user.userId);
        ApiResponse.created(res, { message: 'Comment created', data: { comment } });
    });

    listComments = asyncHandler(async (req, res) => {
        const result = await commentService.listComments(req.query);
        ApiResponse.paginated(res, {
            data: result.comments,
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    });

    updateComment = asyncHandler(async (req, res) => {
        const comment = await commentService.updateComment(
            req.params.id,
            req.body.content,
            req.user.userId
        );
        ApiResponse.success(res, { message: 'Comment updated', data: { comment } });
    });

    deleteComment = asyncHandler(async (req, res) => {
        await commentService.deleteComment(req.params.id, req.user.userId);
        ApiResponse.success(res, { message: 'Comment deleted' });
    });

    addReaction = asyncHandler(async (req, res) => {
        const comment = await commentService.addReaction(
            req.params.id,
            req.user.userId,
            req.body.emoji
        );
        ApiResponse.success(res, { message: 'Reaction added', data: { comment } });
    });

    removeReaction = asyncHandler(async (req, res) => {
        const comment = await commentService.removeReaction(
            req.params.id,
            req.user.userId,
            req.params.emoji
        );
        ApiResponse.success(res, { message: 'Reaction removed', data: { comment } });
    });
}

module.exports = new CommentController();
