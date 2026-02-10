/**
 * @fileoverview Swagger/OpenAPI configuration
 * Generates OpenAPI 3.0 specification from JSDoc annotations.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Task & Team Management API',
            version: '1.0.0',
            description: `
# Task & Team Management API

A comprehensive REST API for managing projects, tasks, teams, and activities.

## Features
- **Authentication**: JWT-based auth with access/refresh token pattern
- **Projects**: Create and manage projects with team members
- **Tasks**: Full task management with status, priority, labels, and assignments
- **Comments**: Task discussions with reactions and mentions
- **Labels**: Categorize tasks with colored labels
- **Activity Logs**: Track all actions for audit and feeds

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

Access tokens expire in 15 minutes. Use the refresh token endpoint to get new tokens.

## Rate Limiting
API requests are rate limited to ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs / 60000} minutes.

## Error Handling
All errors follow a consistent format:
\`\`\`json
{
  "success": false,
  "status": "fail|error",
  "message": "Error description"
}
\`\`\`
      `,
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
            {
                url: 'https://api.example.com',
                description: 'Production server',
            },
        ],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management endpoints' },
            { name: 'Projects', description: 'Project management endpoints' },
            { name: 'Tasks', description: 'Task management endpoints' },
            { name: 'Comments', description: 'Comment management endpoints' },
            { name: 'Labels', description: 'Label management endpoints' },
            { name: 'Activity', description: 'Activity log endpoints' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT access token',
                },
            },
            schemas: {
                // Auth schemas
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password', 'firstName', 'lastName'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                        password: { type: 'string', minLength: 8, example: 'SecurePass123' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                    },
                },
                RefreshTokenRequest: {
                    type: 'object',
                    required: ['refreshToken'],
                    properties: {
                        refreshToken: { type: 'string' },
                    },
                },
                ChangePasswordRequest: {
                    type: 'object',
                    required: ['currentPassword', 'newPassword'],
                    properties: {
                        currentPassword: { type: 'string' },
                        newPassword: { type: 'string', minLength: 8 },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                user: { $ref: '#/components/schemas/User' },
                                tokens: { $ref: '#/components/schemas/Tokens' },
                            },
                        },
                    },
                },
                Tokens: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },

                // User schemas
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        fullName: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'member', 'viewer'] },
                        avatar: { type: 'string', nullable: true },
                        isActive: { type: 'boolean' },
                        lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                UpdateProfileRequest: {
                    type: 'object',
                    properties: {
                        firstName: { type: 'string', maxLength: 50 },
                        lastName: { type: 'string', maxLength: 50 },
                        avatar: { type: 'string', format: 'uri', nullable: true },
                    },
                },
                UpdateRoleRequest: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                        role: { type: 'string', enum: ['admin', 'member', 'viewer'] },
                    },
                },

                // Project schemas
                Project: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        key: { type: 'string' },
                        owner: { $ref: '#/components/schemas/User' },
                        members: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    user: { $ref: '#/components/schemas/User' },
                                    role: { type: 'string', enum: ['owner', 'admin', 'member', 'viewer'] },
                                    joinedAt: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                        status: { type: 'string', enum: ['active', 'archived', 'completed'] },
                        visibility: { type: 'string', enum: ['private', 'public'] },
                        taskCount: { type: 'integer' },
                        completedTaskCount: { type: 'integer' },
                        completionPercentage: { type: 'number' },
                        startDate: { type: 'string', format: 'date-time', nullable: true },
                        endDate: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateProjectRequest: {
                    type: 'object',
                    required: ['name', 'key'],
                    properties: {
                        name: { type: 'string', maxLength: 100 },
                        description: { type: 'string', maxLength: 1000 },
                        key: { type: 'string', pattern: '^[A-Z][A-Z0-9]{1,9}$' },
                        visibility: { type: 'string', enum: ['private', 'public'], default: 'private' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                    },
                },
                UpdateProjectRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', maxLength: 100 },
                        description: { type: 'string', maxLength: 1000 },
                        visibility: { type: 'string', enum: ['private', 'public'] },
                        status: { type: 'string', enum: ['active', 'archived', 'completed'] },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                    },
                },
                AddMemberRequest: {
                    type: 'object',
                    required: ['userId'],
                    properties: {
                        userId: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'member', 'viewer'], default: 'member' },
                    },
                },
                UpdateMemberRoleRequest: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                        role: { type: 'string', enum: ['admin', 'member', 'viewer'] },
                    },
                },

                // Task schemas
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        taskNumber: { type: 'string', example: 'PROJ-1' },
                        project: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                key: { type: 'string' },
                            },
                        },
                        assignee: { $ref: '#/components/schemas/User' },
                        reporter: { $ref: '#/components/schemas/User' },
                        status: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'] },
                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                        type: { type: 'string', enum: ['task', 'bug', 'feature', 'improvement', 'epic', 'story'] },
                        labels: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Label' },
                        },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        estimatedHours: { type: 'number', nullable: true },
                        actualHours: { type: 'number' },
                        isOverdue: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateTaskRequest: {
                    type: 'object',
                    required: ['title', 'projectId'],
                    properties: {
                        title: { type: 'string', maxLength: 200 },
                        description: { type: 'string', maxLength: 5000 },
                        projectId: { type: 'string' },
                        assigneeId: { type: 'string', nullable: true },
                        status: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'], default: 'todo' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
                        type: { type: 'string', enum: ['task', 'bug', 'feature', 'improvement', 'epic', 'story'], default: 'task' },
                        labels: { type: 'array', items: { type: 'string' } },
                        dueDate: { type: 'string', format: 'date-time' },
                        estimatedHours: { type: 'number' },
                        parentTaskId: { type: 'string' },
                    },
                },
                UpdateTaskRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', maxLength: 200 },
                        description: { type: 'string', maxLength: 5000 },
                        assigneeId: { type: 'string', nullable: true },
                        status: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'] },
                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                        type: { type: 'string', enum: ['task', 'bug', 'feature', 'improvement', 'epic', 'story'] },
                        labels: { type: 'array', items: { type: 'string' } },
                        dueDate: { type: 'string', format: 'date-time' },
                        estimatedHours: { type: 'number' },
                        actualHours: { type: 'number' },
                    },
                },
                BulkUpdateTasksRequest: {
                    type: 'object',
                    required: ['taskIds', 'updates'],
                    properties: {
                        taskIds: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 50 },
                        updates: {
                            type: 'object',
                            properties: {
                                status: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'] },
                                priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                                assigneeId: { type: 'string', nullable: true },
                            },
                        },
                    },
                },

                // Comment schemas
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        content: { type: 'string' },
                        task: { type: 'string' },
                        author: { $ref: '#/components/schemas/User' },
                        parentComment: { type: 'string', nullable: true },
                        isEdited: { type: 'boolean' },
                        editedAt: { type: 'string', format: 'date-time', nullable: true },
                        reactions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    user: { type: 'string' },
                                    emoji: { type: 'string' },
                                },
                            },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateCommentRequest: {
                    type: 'object',
                    required: ['content', 'taskId'],
                    properties: {
                        content: { type: 'string', maxLength: 2000 },
                        taskId: { type: 'string' },
                        parentCommentId: { type: 'string' },
                        mentions: { type: 'array', items: { type: 'string' } },
                    },
                },
                UpdateCommentRequest: {
                    type: 'object',
                    required: ['content'],
                    properties: {
                        content: { type: 'string', maxLength: 2000 },
                    },
                },

                // Label schemas
                Label: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                        description: { type: 'string' },
                        project: { type: 'string', nullable: true },
                        isGlobal: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateLabelRequest: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string', maxLength: 50 },
                        color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', default: '#6B7280' },
                        description: { type: 'string', maxLength: 200 },
                        projectId: { type: 'string' },
                    },
                },
                UpdateLabelRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', maxLength: 50 },
                        color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                        description: { type: 'string', maxLength: 200 },
                    },
                },

                // Activity schemas
                Activity: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        action: { type: 'string' },
                        actor: { $ref: '#/components/schemas/User' },
                        entityType: { type: 'string', enum: ['user', 'project', 'task', 'comment', 'label'] },
                        entityId: { type: 'string' },
                        project: { type: 'string', nullable: true },
                        metadata: { type: 'object' },
                        changes: {
                            type: 'object',
                            properties: {
                                before: { type: 'object' },
                                after: { type: 'object' },
                            },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // Common response schemas
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                    },
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                user: { $ref: '#/components/schemas/User' },
                            },
                        },
                    },
                },
                ProjectResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                project: { $ref: '#/components/schemas/Project' },
                            },
                        },
                    },
                },
                TaskResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                task: { $ref: '#/components/schemas/Task' },
                            },
                        },
                    },
                },
                PaginationMeta: {
                    type: 'object',
                    properties: {
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                total: { type: 'integer' },
                                totalPages: { type: 'integer' },
                                hasNextPage: { type: 'boolean' },
                                hasPrevPage: { type: 'boolean' },
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        status: { type: 'string', example: 'fail' },
                        message: { type: 'string' },
                    },
                },
            },
            responses: {
                BadRequest: {
                    description: 'Bad Request',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                status: 'fail',
                                message: 'Validation error: field is required',
                            },
                        },
                    },
                },
                Unauthorized: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                status: 'fail',
                                message: 'Access token is required',
                            },
                        },
                    },
                },
                Forbidden: {
                    description: 'Forbidden',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                status: 'fail',
                                message: 'Access denied',
                            },
                        },
                    },
                },
                NotFound: {
                    description: 'Not Found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                status: 'fail',
                                message: 'Resource not found',
                            },
                        },
                    },
                },
                Conflict: {
                    description: 'Conflict',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                status: 'fail',
                                message: 'Resource already exists',
                            },
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        './src/modules/**/routes/*.js',
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
