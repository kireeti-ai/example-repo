/**
 * @fileoverview Request validation middleware
 * Uses Joi for schema-based request validation.
 */

const Joi = require('joi');
const { ApiError } = require('../utils');

/**
 * Validation sources in Express request
 * @readonly
 * @enum {string}
 */
const ValidationSource = {
    BODY: 'body',
    QUERY: 'query',
    PARAMS: 'params',
};

/**
 * Creates validation middleware for the specified schema and source
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {string} [source='body'] - Request property to validate
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = ValidationSource.BODY) => (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });

    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join(', ');
        return next(ApiError.badRequest(`Validation error: ${errorMessage}`));
    }

    // Replace original data with validated/sanitized data
    req[source] = value;
    next();
};

/**
 * Common validation schemas for reuse
 */
const schemas = {
    /**
     * MongoDB ObjectId validation
     */
    objectId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message('Invalid ID format'),

    /**
     * Pagination query parameters
     */
    pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sortBy: Joi.string().default('createdAt'),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    }),

    /**
     * ID parameter validation
     */
    idParam: Joi.object({
        id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid ID format',
            }),
    }),
};

module.exports = {
    validate,
    ValidationSource,
    schemas,
};
