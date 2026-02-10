/**
 * @fileoverview Async handler wrapper utility
 * Wraps async route handlers to automatically catch and forward errors.
 */

/**
 * Wraps an async function to handle promise rejections
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
