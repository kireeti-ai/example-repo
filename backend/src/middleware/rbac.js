/**
 * @fileoverview Role-based access control middleware
 * Restricts access to endpoints based on user roles.
 */

const { ApiError } = require('../utils');

/**
 * User roles enumeration
 * @readonly
 * @enum {string}
 */
const Roles = {
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer',
};

/**
 * Role hierarchy for permission checking
 * Higher index = more permissions
 */
const roleHierarchy = [Roles.VIEWER, Roles.MEMBER, Roles.ADMIN];

/**
 * Creates middleware to check if user has required role(s)
 * @param {...string} allowedRoles - Roles that are allowed access
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
        return next(ApiError.forbidden(`Access denied. Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
};

/**
 * Check if user has at least the minimum required role level
 * @param {string} minimumRole - Minimum required role
 * @returns {Function} Express middleware function
 */
const authorizeMinRole = (minimumRole) => (req, res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    const userRoleIndex = roleHierarchy.indexOf(req.user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(minimumRole);

    if (userRoleIndex < requiredRoleIndex) {
        return next(ApiError.forbidden(`Access denied. Minimum required role: ${minimumRole}`));
    }

    next();
};

/**
 * Check if user is the resource owner or an admin
 * @param {Function} getResourceOwnerId - Function to extract owner ID from request
 * @returns {Function} Express middleware function
 */
const authorizeOwnerOrAdmin = (getResourceOwnerId) => (req, res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
    }

    const ownerId = getResourceOwnerId(req);
    const isOwner = ownerId && ownerId.toString() === req.user.userId;
    const isAdmin = req.user.role === Roles.ADMIN;

    if (!isOwner && !isAdmin) {
        return next(ApiError.forbidden('Access denied. You can only access your own resources.'));
    }

    next();
};

module.exports = {
    Roles,
    authorize,
    authorizeMinRole,
    authorizeOwnerOrAdmin,
};
