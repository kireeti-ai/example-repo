/**
 * @fileoverview Label service
 */

const Label = require('../Label.model');
const Activity = require('../../activity/Activity.model');
const { ApiError } = require('../../../utils');

class LabelService {
    async createLabel(labelData, creatorId) {
        const { projectId, ...rest } = labelData;

        const existingLabel = await Label.findOne({
            name: rest.name,
            project: projectId || null,
            isArchived: false,
        });

        if (existingLabel) {
            throw ApiError.conflict('Label with this name already exists');
        }

        const label = await Label.create({
            ...rest,
            project: projectId || null,
            createdBy: creatorId,
        });

        await Activity.log({
            action: 'label.create',
            actor: creatorId,
            entityType: 'label',
            entityId: label._id,
            project: projectId || null,
            metadata: { labelName: label.name, labelColor: label.color },
        });

        return label.toJSON();
    }

    async listLabels(options = {}) {
        const { projectId, includeGlobal = true } = options;

        const filter = { isArchived: false };

        if (projectId) {
            if (includeGlobal) {
                filter.$or = [{ project: projectId }, { project: null }];
            } else {
                filter.project = projectId;
            }
        } else {
            filter.project = null;
        }

        const labels = await Label.find(filter)
            .populate('createdBy', 'firstName lastName')
            .sort({ name: 1 });

        return labels.map(l => l.toJSON());
    }

    async getLabelById(labelId) {
        const label = await Label.findById(labelId).populate('createdBy', 'firstName lastName');
        if (!label || label.isArchived) {
            throw ApiError.notFound('Label not found');
        }
        return label.toJSON();
    }

    async updateLabel(labelId, updateData, userId) {
        const label = await Label.findById(labelId);
        if (!label || label.isArchived) {
            throw ApiError.notFound('Label not found');
        }

        Object.assign(label, updateData);
        await label.save();

        await Activity.log({
            action: 'label.update',
            actor: userId,
            entityType: 'label',
            entityId: labelId,
            project: label.project,
        });

        return label.toJSON();
    }

    async deleteLabel(labelId, userId) {
        const label = await Label.findById(labelId);
        if (!label) {
            throw ApiError.notFound('Label not found');
        }

        label.isArchived = true;
        await label.save();

        await Activity.log({
            action: 'label.delete',
            actor: userId,
            entityType: 'label',
            entityId: labelId,
            project: label.project,
        });
    }
}

module.exports = new LabelService();
