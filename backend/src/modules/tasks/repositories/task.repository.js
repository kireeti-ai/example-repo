/**
 * @fileoverview Task repository
 * Data access layer for task operations.
 */

const Task = require('../Task.model');

/**
 * @class TaskRepository
 * @description Data access methods for Task model
 */
class TaskRepository {
    /**
     * Find task by ID
     * @param {string} id - Task ID
     * @param {Object} [options] - Query options
     * @returns {Promise<Task|null>}
     */
    async findById(id, options = {}) {
        let query = Task.findById(id);

        if (options.populate) {
            if (options.populate.includes('project')) {
                query = query.populate('project', 'name key');
            }
            if (options.populate.includes('assignee')) {
                query = query.populate('assignee', 'firstName lastName email avatar');
            }
            if (options.populate.includes('reporter')) {
                query = query.populate('reporter', 'firstName lastName email avatar');
            }
            if (options.populate.includes('labels')) {
                query = query.populate('labels', 'name color');
            }
            if (options.populate.includes('subtasks')) {
                query = query.populate('subtasks');
            }
        }

        return query.exec();
    }

    /**
     * Find task by task number
     * @param {string} taskNumber - Task number (e.g., "PROJ-1")
     * @returns {Promise<Task|null>}
     */
    async findByTaskNumber(taskNumber) {
        return Task.findOne({ taskNumber: taskNumber.toUpperCase() })
            .populate('project', 'name key')
            .populate('assignee', 'firstName lastName email avatar')
            .populate('reporter', 'firstName lastName email avatar')
            .populate('labels', 'name color');
    }

    /**
     * Find tasks with pagination and filtering
     * @param {Object} options - Query options
     * @returns {Promise<{tasks: Task[], total: number}>}
     */
    async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            projectId,
            status,
            priority,
            assigneeId,
            type,
            search,
            overdue,
        } = options;

        const filter = {};

        if (projectId) {
            filter.project = projectId;
        }

        if (status) {
            if (Array.isArray(status)) {
                filter.status = { $in: status };
            } else {
                filter.status = status;
            }
        }

        if (priority) {
            filter.priority = priority;
        }

        if (assigneeId) {
            filter.assignee = assigneeId;
        }

        if (type) {
            filter.type = type;
        }

        if (overdue === true) {
            filter.dueDate = { $lt: new Date() };
            filter.status = { $nin: ['done', 'cancelled'] };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { taskNumber: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .populate('project', 'name key')
                .populate('assignee', 'firstName lastName email avatar')
                .populate('reporter', 'firstName lastName email avatar')
                .populate('labels', 'name color')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit),
            Task.countDocuments(filter),
        ]);

        return { tasks, total };
    }

    /**
     * Find tasks by project
     * @param {string} projectId - Project ID
     * @param {Object} options - Query options
     * @returns {Promise<Task[]>}
     */
    async findByProject(projectId, options = {}) {
        const { status, groupByStatus = false } = options;

        const filter = { project: projectId };
        if (status) {
            filter.status = Array.isArray(status) ? { $in: status } : status;
        }

        const tasks = await Task.find(filter)
            .populate('assignee', 'firstName lastName email avatar')
            .populate('labels', 'name color')
            .sort({ order: 1, createdAt: -1 });

        if (groupByStatus) {
            const grouped = {};
            tasks.forEach((task) => {
                if (!grouped[task.status]) {
                    grouped[task.status] = [];
                }
                grouped[task.status].push(task);
            });
            return grouped;
        }

        return tasks;
    }

    /**
     * Create a new task
     * @param {Object} taskData - Task data
     * @returns {Promise<Task>}
     */
    async create(taskData) {
        const task = await Task.create(taskData);
        return this.findById(task._id, {
            populate: ['project', 'assignee', 'reporter', 'labels'],
        });
    }

    /**
     * Update task by ID
     * @param {string} id - Task ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Task|null>}
     */
    async updateById(id, updateData) {
        return Task.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate('project', 'name key')
            .populate('assignee', 'firstName lastName email avatar')
            .populate('reporter', 'firstName lastName email avatar')
            .populate('labels', 'name color');
    }

    /**
     * Delete task by ID
     * @param {string} id - Task ID
     * @returns {Promise<Task|null>}
     */
    async deleteById(id) {
        return Task.findByIdAndDelete(id);
    }

    /**
     * Bulk update tasks
     * @param {string[]} taskIds - Array of task IDs
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>}
     */
    async bulkUpdate(taskIds, updateData) {
        const result = await Task.updateMany(
            { _id: { $in: taskIds } },
            { $set: updateData }
        );
        return result;
    }

    /**
     * Get task statistics for a project
     * @param {string} projectId - Project ID
     * @returns {Promise<Object>}
     */
    async getProjectTaskStats(projectId) {
        return Task.aggregate([
            { $match: { project: projectId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalEstimatedHours: { $sum: { $ifNull: ['$estimatedHours', 0] } },
                    totalActualHours: { $sum: { $ifNull: ['$actualHours', 0] } },
                },
            },
        ]);
    }

    /**
     * Get user task statistics
     * @param {string} userId - User ID
     * @returns {Promise<Object>}
     */
    async getUserTaskStats(userId) {
        return Task.aggregate([
            { $match: { assignee: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
    }
}

module.exports = new TaskRepository();
