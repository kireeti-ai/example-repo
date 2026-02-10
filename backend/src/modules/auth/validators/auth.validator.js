/**
 * @fileoverview Auth validation schemas
 * Joi validation schemas for authentication endpoints.
 */

const Joi = require('joi');

/**
 * Password validation pattern
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * User registration schema
 */
const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(passwordPattern)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            'any.required': 'Password is required',
        }),
    firstName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.min': 'First name is required',
            'string.max': 'First name cannot exceed 50 characters',
            'any.required': 'First name is required',
        }),
    lastName: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.min': 'Last name is required',
            'string.max': 'Last name cannot exceed 50 characters',
            'any.required': 'Last name is required',
        }),
});

/**
 * User login schema
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required',
        }),
});

/**
 * Refresh token schema
 */
const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token is required',
        }),
});

/**
 * Change password schema
 */
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Current password is required',
        }),
    newPassword: Joi.string()
        .min(8)
        .max(100)
        .pattern(passwordPattern)
        .required()
        .messages({
            'string.min': 'New password must be at least 8 characters',
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
            'any.required': 'New password is required',
        }),
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    changePasswordSchema,
};
