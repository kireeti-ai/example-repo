/**
 * @fileoverview Label controller
 */

const labelService = require('../services/label.service');
const { ApiResponse, asyncHandler } = require('../../../utils');

class LabelController {
    createLabel = asyncHandler(async (req, res) => {
        const label = await labelService.createLabel(req.body, req.user.userId);
        ApiResponse.created(res, { message: 'Label created', data: { label } });
    });

    listLabels = asyncHandler(async (req, res) => {
        const labels = await labelService.listLabels(req.query);
        ApiResponse.success(res, { data: { labels } });
    });

    getLabelById = asyncHandler(async (req, res) => {
        const label = await labelService.getLabelById(req.params.id);
        ApiResponse.success(res, { data: { label } });
    });

    updateLabel = asyncHandler(async (req, res) => {
        const label = await labelService.updateLabel(req.params.id, req.body, req.user.userId);
        ApiResponse.success(res, { message: 'Label updated', data: { label } });
    });

    deleteLabel = asyncHandler(async (req, res) => {
        await labelService.deleteLabel(req.params.id, req.user.userId);
        ApiResponse.success(res, { message: 'Label deleted' });
    });
}

module.exports = new LabelController();
