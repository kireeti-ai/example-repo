/**
 * @fileoverview API Response helper utility
 * Standardizes API response format across all endpoints.
 */

/**
 * @class ApiResponse
 * @description Helper class for standardized API responses
 */
class ApiResponse {
    /**
     * Send a success response
     * @param {Object} res - Express response object
     * @param {Object} options - Response options
     * @param {number} [options.statusCode=200] - HTTP status code
     * @param {string} [options.message='Success'] - Success message
     * @param {*} [options.data=null] - Response data
     * @param {Object} [options.meta=null] - Metadata (pagination, etc.)
     */
    static success(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
        const response = {
            success: true,
            message,
        };

        if (data !== null) {
            response.data = data;
        }

        if (meta !== null) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Send a created response (201)
     * @param {Object} res - Express response object
     * @param {Object} options - Response options
     * @param {string} [options.message='Created successfully'] - Success message
     * @param {*} [options.data=null] - Response data
     */
    static created(res, { message = 'Created successfully', data = null }) {
        return this.success(res, { statusCode: 201, message, data });
    }

    /**
     * Send a no content response (204)
     * @param {Object} res - Express response object
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Send paginated response
     * @param {Object} res - Express response object
     * @param {Object} options - Response options
     * @param {Array} options.data - Array of items
     * @param {number} options.page - Current page number
     * @param {number} options.limit - Items per page
     * @param {number} options.total - Total number of items
     * @param {string} [options.message='Success'] - Success message
     */
    static paginated(res, { data, page, limit, total, message = 'Success' }) {
        const totalPages = Math.ceil(total / limit);

        return this.success(res, {
            message,
            data,
            meta: {
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    }
}

module.exports = ApiResponse;
