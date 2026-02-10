/**
 * @fileoverview Project repository
 * Data access layer for project operations.
 */

const Project = require('../Project.model');

/**
 * @class ProjectRepository
 * @description Data access methods for Project model
 */
class ProjectRepository {
    /**
     * Find project by ID
     * @param {string} id - Project ID
     * @param {Object} [options] - Query options
     * @returns {Promise<Project|null>}
     */
    async findById(id, options = {}) {
        let query = Project.findById(id);

        if (options.populate) {
            if (options.populate.includes('owner')) {
                query = query.populate('owner', 'firstName lastName email avatar');
            }
            if (options.populate.includes('members')) {
                query = query.populate('members.user', 'firstName lastName email avatar');
            }
        }

        return query.exec();
    }

    /**
     * Find project by key
     * @param {string} key - Project key
     * @returns {Promise<Project|null>}
     */
    async findByKey(key) {
        return Project.findOne({ key: key.toUpperCase() });
    }

    /**
     * Find projects accessible to user with pagination
     * @param {string} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<{projects: Project[], total: number}>}
     */
    async findUserProjects(userId, options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            status,
            visibility,
            search,
        } = options;

        const filter = {
            $or: [
                { owner: userId },
                { 'members.user': userId },
                { visibility: 'public' },
            ],
        };

        if (status) {
            filter.status = status;
        }

        if (visibility) {
            filter.visibility = visibility;
        }

        if (search) {
            filter.$and = [
                { $or: filter.$or },
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { key: { $regex: search, $options: 'i' } },
                    ],
                },
            ];
            delete filter.$or;
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const [projects, total] = await Promise.all([
            Project.find(filter)
                .populate('owner', 'firstName lastName email avatar')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit),
            Project.countDocuments(filter),
        ]);

        return { projects, total };
    }

    /**
     * Create a new project
     * @param {Object} projectData - Project data
     * @returns {Promise<Project>}
     */
    async create(projectData) {
        return Project.create(projectData);
    }

    /**
     * Update project by ID
     * @param {string} id - Project ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Project|null>}
     */
    async updateById(id, updateData) {
        return Project.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate('owner', 'firstName lastName email avatar')
            .populate('members.user', 'firstName lastName email avatar');
    }

    /**
     * Delete project by ID
     * @param {string} id - Project ID
     * @returns {Promise<Project|null>}
     */
    async deleteById(id) {
        return Project.findByIdAndDelete(id);
    }

    /**
     * Add member to project
     * @param {string} projectId - Project ID
     * @param {Object} memberData - Member data {user, role}
     * @returns {Promise<Project>}
     */
    async addMember(projectId, memberData) {
        return Project.findByIdAndUpdate(
            projectId,
            {
                $push: {
                    members: {
                        user: memberData.userId,
                        role: memberData.role,
                        joinedAt: new Date(),
                    },
                },
            },
            { new: true }
        ).populate('members.user', 'firstName lastName email avatar');
    }

    /**
     * Remove member from project
     * @param {string} projectId - Project ID
     * @param {string} userId - User ID to remove
     * @returns {Promise<Project>}
     */
    async removeMember(projectId, userId) {
        return Project.findByIdAndUpdate(
            projectId,
            { $pull: { members: { user: userId } } },
            { new: true }
        ).populate('members.user', 'firstName lastName email avatar');
    }

    /**
     * Update member role
     * @param {string} projectId - Project ID
     * @param {string} userId - User ID
     * @param {string} newRole - New role
     * @returns {Promise<Project>}
     */
    async updateMemberRole(projectId, userId, newRole) {
        return Project.findOneAndUpdate(
            { _id: projectId, 'members.user': userId },
            { $set: { 'members.$.role': newRole } },
            { new: true }
        ).populate('members.user', 'firstName lastName email avatar');
    }

    /**
     * Get project statistics
     * @returns {Promise<Object>}
     */
    async getStatistics() {
        const result = await Project.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalTasks: { $sum: '$taskCount' },
                    completedTasks: { $sum: '$completedTaskCount' },
                },
            },
        ]);

        return result;
    }

    /**
     * Get projects with task analytics (aggregation example)
     * @param {Object} options - Aggregation options
     * @returns {Promise<Object[]>}
     */
    async getProjectsWithAnalytics(options = {}) {
        const { limit = 10 } = options;

        return Project.aggregate([
            { $match: { status: 'active' } },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'project',
                    as: 'tasks',
                },
            },
            {
                $addFields: {
                    totalTasks: { $size: '$tasks' },
                    completedTasks: {
                        $size: {
                            $filter: {
                                input: '$tasks',
                                as: 'task',
                                cond: { $eq: ['$$task.status', 'done'] },
                            },
                        },
                    },
                    overdueTasks: {
                        $size: {
                            $filter: {
                                input: '$tasks',
                                as: 'task',
                                cond: {
                                    $and: [
                                        { $ne: ['$$task.status', 'done'] },
                                        { $lt: ['$$task.dueDate', new Date()] },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    completionRate: {
                        $cond: [
                            { $eq: ['$totalTasks', 0] },
                            0,
                            {
                                $multiply: [
                                    { $divide: ['$completedTasks', '$totalTasks'] },
                                    100,
                                ],
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    key: 1,
                    status: 1,
                    totalTasks: 1,
                    completedTasks: 1,
                    overdueTasks: 1,
                    completionRate: { $round: ['$completionRate', 1] },
                },
            },
            { $sort: { completionRate: -1 } },
            { $limit: limit },
        ]);
    }
}

module.exports = new ProjectRepository();
