/**
 * @fileoverview Search service
 * Business logic for global cross-entity search across tasks, projects, and users.
 */

const Task = require('../../tasks/Task.model');
const Project = require('../../projects/Project.model');
const User = require('../../users/User.model');
const Comment = require('../../comments/Comment.model');

/**
 * @class SearchService
 * @description Handles global search across multiple entity types
 */
class SearchService {
    /**
     * Perform a global search across multiple entities
     * @param {string} query - Search query string
     * @param {Object} options - Search options
     * @param {string} options.scope - Search scope ('all', 'tasks', 'projects', 'users', 'comments')
     * @param {number} options.limit - Max results per entity type
     * @param {string} userId - ID of the searching user
     * @returns {Promise<Object>}
     */
    async globalSearch(query, options = {}, userId) {
        const {
            scope = 'all',
            limit = 10,
        } = options;

        const searchRegex = new RegExp(query, 'i');
        const results = {};

        const searchPromises = [];

        if (scope === 'all' || scope === 'tasks') {
            searchPromises.push(
                this._searchTasks(searchRegex, limit).then((tasks) => {
                    results.tasks = tasks;
                })
            );
        }

        if (scope === 'all' || scope === 'projects') {
            searchPromises.push(
                this._searchProjects(searchRegex, limit, userId).then((projects) => {
                    results.projects = projects;
                })
            );
        }

        if (scope === 'all' || scope === 'users') {
            searchPromises.push(
                this._searchUsers(searchRegex, limit).then((users) => {
                    results.users = users;
                })
            );
        }

        if (scope === 'all' || scope === 'comments') {
            searchPromises.push(
                this._searchComments(searchRegex, limit).then((comments) => {
                    results.comments = comments;
                })
            );
        }

        await Promise.all(searchPromises);

        // Calculate total results count
        let totalCount = 0;
        Object.values(results).forEach((arr) => {
            totalCount += arr.length;
        });

        return {
            query,
            totalCount,
            results,
        };
    }

    /**
     * Search tasks by title, description, or task number
     * @param {RegExp} searchRegex - Search regex pattern
     * @param {number} limit - Max results
     * @returns {Promise<Object[]>}
     */
    async _searchTasks(searchRegex, limit) {
        return Task.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { taskNumber: searchRegex },
            ],
        })
            .populate('project', 'name key')
            .populate('assignee', 'firstName lastName email avatar')
            .select('title taskNumber status priority project assignee dueDate createdAt')
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean();
    }

    /**
     * Search projects by name, description, or key
     * @param {RegExp} searchRegex - Search regex pattern
     * @param {number} limit - Max results
     * @param {string} userId - User ID for access control
     * @returns {Promise<Object[]>}
     */
    async _searchProjects(searchRegex, limit, userId) {
        return Project.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { key: searchRegex },
            ],
            $and: [
                {
                    $or: [
                        { visibility: 'public' },
                        { owner: userId },
                        { 'members.user': userId },
                    ],
                },
            ],
        })
            .populate('owner', 'firstName lastName email avatar')
            .select('name key description status owner taskCount completedTaskCount visibility createdAt')
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean();
    }

    /**
     * Search users by name or email
     * @param {RegExp} searchRegex - Search regex pattern
     * @param {number} limit - Max results
     * @returns {Promise<Object[]>}
     */
    async _searchUsers(searchRegex, limit) {
        return User.find({
            isActive: true,
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
            ],
        })
            .select('firstName lastName email role avatar createdAt')
            .sort({ firstName: 1 })
            .limit(limit)
            .lean();
    }

    /**
     * Search comments by content
     * @param {RegExp} searchRegex - Search regex pattern
     * @param {number} limit - Max results
     * @returns {Promise<Object[]>}
     */
    async _searchComments(searchRegex, limit) {
        return Comment.find({
            content: searchRegex,
            isDeleted: { $ne: true },
        })
            .populate('author', 'firstName lastName email avatar')
            .populate('task', 'title taskNumber')
            .select('content author task createdAt')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }
}

module.exports = new SearchService();
