/**
 * @fileoverview Project service
 * Business logic for project operations.
 */

const projectRepository = require('../repositories/project.repository');
const Activity = require('../../activity/Activity.model');
const User = require('../../users/User.model');
const { ApiError } = require('../../../utils');

/**
 * @class ProjectService
 * @description Handles project business logic
 */
class ProjectService {
    /**
     * Create a new project
     * @param {Object} projectData - Project data
     * @param {string} ownerId - ID of the user creating the project
     * @returns {Promise<Object>}
     * @throws {ApiError} If project key already exists
     */
    async createProject(projectData, ownerId) {
        // Check if key already exists
        const existingProject = await projectRepository.findByKey(projectData.key);
        if (existingProject) {
            throw ApiError.conflict('Project key already exists');
        }

        const project = await projectRepository.create({
            ...projectData,
            owner: ownerId,
        });

        // Log activity
        await Activity.log({
            action: 'project.create',
            actor: ownerId,
            entityType: 'project',
            entityId: project._id,
            project: project._id,
            metadata: { projectName: project.name, projectKey: project.key },
        });

        return project.toJSON();
    }

    /**
     * Get project by ID
     * @param {string} projectId - Project ID
     * @param {string} userId - ID of requesting user
     * @returns {Promise<Object>}
     * @throws {ApiError} If project not found or user doesn't have access
     */
    async getProjectById(projectId, userId) {
        const project = await projectRepository.findById(projectId, {
            populate: ['owner', 'members'],
        });

        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        // Check access
        if (project.visibility === 'private' && !project.isMember(userId)) {
            throw ApiError.forbidden('You do not have access to this project');
        }

        return project.toJSON();
    }

    /**
     * List projects accessible to user
     * @param {string} userId - User ID
     * @param {Object} options - Query options
     * @returns {Promise<{projects: Object[], total: number, page: number, limit: number}>}
     */
    async listProjects(userId, options = {}) {
        const { projects, total } = await projectRepository.findUserProjects(userId, options);

        return {
            projects: projects.map((project) => project.toJSON()),
            total,
            page: options.page || 1,
            limit: options.limit || 10,
        };
    }

    /**
     * Update project
     * @param {string} projectId - Project ID
     * @param {Object} updateData - Data to update
     * @param {string} userId - ID of user performing the update
     * @returns {Promise<Object>}
     * @throws {ApiError} If project not found or user doesn't have permission
     */
    async updateProject(projectId, updateData, userId) {
        const project = await projectRepository.findById(projectId);

        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        // Check permission (owner or admin only)
        const memberRole = project.getMemberRole(userId);
        if (project.owner.toString() !== userId && memberRole !== 'admin') {
            throw ApiError.forbidden('Only project owner or admins can update the project');
        }

        const beforeData = {
            name: project.name,
            description: project.description,
            status: project.status,
            visibility: project.visibility,
        };

        const updatedProject = await projectRepository.updateById(projectId, updateData);

        // Log activity
        await Activity.log({
            action: 'project.update',
            actor: userId,
            entityType: 'project',
            entityId: projectId,
            project: projectId,
            changes: {
                before: beforeData,
                after: updateData,
            },
        });

        return updatedProject.toJSON();
    }

    /**
     * Delete project
     * @param {string} projectId - Project ID
     * @param {string} userId - ID of user deleting the project
     * @returns {Promise<void>}
     * @throws {ApiError} If project not found or user is not the owner
     */
    async deleteProject(projectId, userId) {
        const project = await projectRepository.findById(projectId);

        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        // Only owner can delete
        if (project.owner.toString() !== userId) {
            throw ApiError.forbidden('Only the project owner can delete the project');
        }

        await projectRepository.deleteById(projectId);

        // Log activity
        await Activity.log({
            action: 'project.delete',
            actor: userId,
            entityType: 'project',
            entityId: projectId,
            metadata: { projectName: project.name, projectKey: project.key },
        });
    }

    /**
     * Add member to project
     * @param {string} projectId - Project ID
     * @param {Object} memberData - Member data {userId, role}
     * @param {string} actorId - ID of user adding the member
     * @returns {Promise<Object>}
     * @throws {ApiError} If project not found or user doesn't have permission
     */
    async addMember(projectId, memberData, actorId) {
        const project = await projectRepository.findById(projectId);

        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        // Check permission (owner or admin only)
        const actorRole = project.getMemberRole(actorId);
        if (project.owner.toString() !== actorId && actorRole !== 'admin') {
            throw ApiError.forbidden('Only project owner or admins can add members');
        }

        // Check if user exists
        const user = await User.findById(memberData.userId);
        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Check if already a member
        if (project.isMember(memberData.userId)) {
            throw ApiError.conflict('User is already a member of this project');
        }

        const updatedProject = await projectRepository.addMember(projectId, memberData);

        // Log activity
        await Activity.log({
            action: 'project.member_add',
            actor: actorId,
            entityType: 'project',
            entityId: projectId,
            project: projectId,
            metadata: {
                addedUserId: memberData.userId,
                addedUserName: user.fullName,
                role: memberData.role,
            },
        });

        return updatedProject.toJSON();
    }

    /**
     * Remove member from project
     * @param {string} projectId - Project ID
     * @param {string} memberId - User ID to remove
     * @param {string} actorId - ID of user removing the member
     * @returns {Promise<Object>}
     * @throws {ApiError} If project not found or user doesn't have permission
     */
    async removeMember(projectId, memberId, actorId) {
        const project = await projectRepository.findById(projectId);

        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        // Check permission (owner or admin only, or self-removal)
        const actorRole = project.getMemberRole(actorId);
        const isSelfRemoval = actorId === memberId;

        if (!isSelfRemoval && project.owner.toString() !== actorId && actorRole !== 'admin') {
            throw ApiError.forbidden('Only project owner or admins can remove members');
        }

        // Cannot remove owner
        if (project.owner.toString() === memberId) {
            throw ApiError.badRequest('Cannot remove the project owner');
        }

        // Check if user is actually a member
        if (!project.isMember(memberId)) {
            throw ApiError.notFound('User is not a member of this project');
        }

        const updatedProject = await projectRepository.removeMember(projectId, memberId);

        // Log activity
        await Activity.log({
            action: 'project.member_remove',
            actor: actorId,
            entityType: 'project',
            entityId: projectId,
            project: projectId,
            metadata: { removedUserId: memberId },
        });

        return updatedProject.toJSON();
    }

    /**
     * Update member role
     * @param {string} projectId - Project ID
     * @param {string} memberId - User ID
     * @param {string} newRole - New role
     * @param {string} actorId - ID of user changing the role
     * @returns {Promise<Object>}
     * @throws {ApiError} If project not found or user doesn't have permission
     */
    async updateMemberRole(projectId, memberId, newRole, actorId) {
        const project = await projectRepository.findById(projectId);

        if (!project) {
            throw ApiError.notFound('Project not found');
        }

        // Only owner can change roles
        if (project.owner.toString() !== actorId) {
            throw ApiError.forbidden('Only the project owner can change member roles');
        }

        // Cannot change owner's role
        if (project.owner.toString() === memberId) {
            throw ApiError.badRequest('Cannot change the project owner\'s role');
        }

        // Check if user is actually a member
        const member = project.members.find(
            (m) => m.user.toString() === memberId
        );
        if (!member) {
            throw ApiError.notFound('User is not a member of this project');
        }

        const beforeRole = member.role;
        const updatedProject = await projectRepository.updateMemberRole(
            projectId,
            memberId,
            newRole
        );

        // Log activity
        await Activity.log({
            action: 'project.member_role_change',
            actor: actorId,
            entityType: 'project',
            entityId: projectId,
            project: projectId,
            changes: {
                before: { role: beforeRole },
                after: { role: newRole },
            },
            metadata: { memberId },
        });

        return updatedProject.toJSON();
    }

    /**
     * Get project analytics
     * @param {Object} options - Query options
     * @returns {Promise<Object[]>}
     */
    async getProjectAnalytics(options = {}) {
        return projectRepository.getProjectsWithAnalytics(options);
    }

    /**
     * Get project statistics
     * @returns {Promise<Object>}
     */
    async getStatistics() {
        return projectRepository.getStatistics();
    }
}

module.exports = new ProjectService();
