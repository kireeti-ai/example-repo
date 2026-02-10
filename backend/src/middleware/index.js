/**
 * @fileoverview Middleware index
 * Exports all middleware modules from a single entry point.
 */

const { authenticate, optionalAuth } = require('./auth');
const { Roles, authorize, authorizeMinRole, authorizeOwnerOrAdmin } = require('./rbac');
const { validate, ValidationSource, schemas } = require('./validate');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const requestLogger = require('./requestLogger');

module.exports = {
    // Authentication
    authenticate,
    optionalAuth,

    // Authorization
    Roles,
    authorize,
    authorizeMinRole,
    authorizeOwnerOrAdmin,

    // Validation
    validate,
    ValidationSource,
    schemas,

    // Error handling
    errorHandler,
    notFoundHandler,

    // Logging
    requestLogger,
};
