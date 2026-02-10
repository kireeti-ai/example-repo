/**
 * @fileoverview Activity service
 */

const Activity = require('../Activity.model');

class ActivityService {
    async getProjectActivities(projectId, options = {}) {
        const { page = 1, limit = 50 } = options;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            Activity.find({ project: projectId })
                .populate('actor', 'firstName lastName email avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Activity.countDocuments({ project: projectId }),
        ]);

        return { activities: activities.map(a => a.toJSON()), total, page, limit };
    }

    async getUserActivities(userId, options = {}) {
        const { page = 1, limit = 50 } = options;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            Activity.find({ actor: userId })
                .populate('actor', 'firstName lastName email avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Activity.countDocuments({ actor: userId }),
        ]);

        return { activities: activities.map(a => a.toJSON()), total, page, limit };
    }

    async getEntityActivities(entityType, entityId, options = {}) {
        const { page = 1, limit = 50 } = options;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            Activity.find({ entityType, entityId })
                .populate('actor', 'firstName lastName email avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Activity.countDocuments({ entityType, entityId }),
        ]);

        return { activities: activities.map(a => a.toJSON()), total, page, limit };
    }
}

module.exports = new ActivityService();
