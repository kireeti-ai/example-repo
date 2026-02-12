/**
 * @fileoverview Dashboard service
 * Business logic for dashboard analytics and statistics.
 */

const User = require('../../users/User.model');
const Project = require('../../projects/Project.model');
const Task = require('../../tasks/Task.model');
const Activity = require('../../activity/Activity.model');
const mongoose = require('mongoose');

/**
 * @class DashboardService
 * @description Handles dashboard analytics and aggregation logic
 */
class DashboardService {
    /**
     * Get a comprehensive dashboard overview for a user
     * @param {string} userId - ID of the requesting user
     * @returns {Promise<Object>}
     */
    async getDashboardOverview(userId) {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const [
            taskStats,
            projectStats,
            recentActivity,
            upcomingDeadlines,
            overdueTaskCount,
        ] = await Promise.all([
            this._getUserTaskStats(userObjectId),
            this._getUserProjectStats(userObjectId),
            this._getRecentActivity(userObjectId, 10),
            this._getUpcomingDeadlines(userObjectId, 5),
            this._getOverdueTaskCount(userObjectId),
        ]);

        return {
            tasks: taskStats,
            projects: projectStats,
            recentActivity,
            upcomingDeadlines,
            overdueTaskCount,
        };
    }

    /**
     * Get system-wide admin dashboard statistics
     * @returns {Promise<Object>}
     */
    async getAdminDashboard() {
        const [
            userStats,
            projectStats,
            taskStats,
            registrationTrend,
            taskCompletionTrend,
        ] = await Promise.all([
            this._getSystemUserStats(),
            this._getSystemProjectStats(),
            this._getSystemTaskStats(),
            this._getRegistrationTrend(30),
            this._getTaskCompletionTrend(30),
        ]);

        return {
            users: userStats,
            projects: projectStats,
            tasks: taskStats,
            trends: {
                registrations: registrationTrend,
                taskCompletions: taskCompletionTrend,
            },
        };
    }

    /**
     * Get workload distribution across team members for a project
     * @param {string} projectId - Project ID
     * @returns {Promise<Object>}
     */
    async getProjectWorkload(projectId) {
        const projectObjectId = new mongoose.Types.ObjectId(projectId);

        const workload = await Task.aggregate([
            { $match: { project: projectObjectId, status: { $nin: ['done', 'cancelled'] } } },
            {
                $group: {
                    _id: '$assignee',
                    totalTasks: { $sum: 1 },
                    byPriority: {
                        $push: '$priority',
                    },
                    byStatus: {
                        $push: '$status',
                    },
                    totalEstimatedHours: { $sum: { $ifNull: ['$estimatedHours', 0] } },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        { $project: { firstName: 1, lastName: 1, email: 1, avatar: 1 } },
                    ],
                },
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $sort: { totalTasks: -1 } },
        ]);

        // Transform priority and status arrays into counts
        return workload.map((item) => ({
            user: item.user || { firstName: 'Unassigned', lastName: '' },
            totalTasks: item.totalTasks,
            totalEstimatedHours: item.totalEstimatedHours,
            priorityBreakdown: {
                urgent: item.byPriority.filter((p) => p === 'urgent').length,
                high: item.byPriority.filter((p) => p === 'high').length,
                medium: item.byPriority.filter((p) => p === 'medium').length,
                low: item.byPriority.filter((p) => p === 'low').length,
            },
            statusBreakdown: {
                backlog: item.byStatus.filter((s) => s === 'backlog').length,
                todo: item.byStatus.filter((s) => s === 'todo').length,
                in_progress: item.byStatus.filter((s) => s === 'in_progress').length,
                in_review: item.byStatus.filter((s) => s === 'in_review').length,
            },
        }));
    }

    // --- Private helper methods ---

    async _getUserTaskStats(userObjectId) {
        const stats = await Task.aggregate([
            { $match: { assignee: userObjectId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const result = {
            total: 0,
            backlog: 0,
            todo: 0,
            in_progress: 0,
            in_review: 0,
            done: 0,
            cancelled: 0,
        };

        stats.forEach((s) => {
            result[s._id] = s.count;
            result.total += s.count;
        });

        return result;
    }

    async _getUserProjectStats(userObjectId) {
        const [ownedCount, memberCount] = await Promise.all([
            Project.countDocuments({ owner: userObjectId, status: 'active' }),
            Project.countDocuments({ 'members.user': userObjectId, status: 'active' }),
        ]);

        return {
            owned: ownedCount,
            memberOf: memberCount,
            total: ownedCount + memberCount,
        };
    }

    async _getRecentActivity(userObjectId, limit) {
        return Activity.find({ actor: userObjectId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('project', 'name key')
            .lean();
    }

    async _getUpcomingDeadlines(userObjectId, limit) {
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        return Task.find({
            assignee: userObjectId,
            dueDate: { $gte: now, $lte: sevenDaysFromNow },
            status: { $nin: ['done', 'cancelled'] },
        })
            .sort({ dueDate: 1 })
            .limit(limit)
            .populate('project', 'name key')
            .select('title taskNumber dueDate priority status project')
            .lean();
    }

    async _getOverdueTaskCount(userObjectId) {
        return Task.countDocuments({
            assignee: userObjectId,
            dueDate: { $lt: new Date() },
            status: { $nin: ['done', 'cancelled'] },
        });
    }

    async _getSystemUserStats() {
        const [total, activeCount, roleStats] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
            ]),
        ]);

        const byRole = {};
        roleStats.forEach((r) => {
            byRole[r._id] = r.count;
        });

        return {
            total,
            active: activeCount,
            inactive: total - activeCount,
            byRole,
        };
    }

    async _getSystemProjectStats() {
        const stats = await Project.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const result = { total: 0, active: 0, archived: 0, completed: 0 };
        stats.forEach((s) => {
            result[s._id] = s.count;
            result.total += s.count;
        });

        return result;
    }

    async _getSystemTaskStats() {
        const stats = await Task.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const result = {
            total: 0,
            backlog: 0,
            todo: 0,
            in_progress: 0,
            in_review: 0,
            done: 0,
            cancelled: 0,
        };
        stats.forEach((s) => {
            result[s._id] = s.count;
            result.total += s.count;
        });

        return result;
    }

    async _getRegistrationTrend(days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1,
                },
            },
        ]);
    }

    async _getTaskCompletionTrend(days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return Task.aggregate([
            { $match: { completedAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1,
                },
            },
        ]);
    }
}

module.exports = new DashboardService();
