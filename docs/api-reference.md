# API Reference

Base URL: `http://localhost:5000/api/v1`

## Authentication

### Register
```
POST /auth/register
Body: { email, password, firstName, lastName }
Response: { user, tokens: { accessToken, refreshToken } }
```

### Login
```
POST /auth/login
Body: { email, password }
Response: { user, tokens }
```

### Refresh Token
```
POST /auth/refresh
Body: { refreshToken }
Response: { tokens }
```

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>
Response: { user }
```

## Projects

### List Projects
```
GET /projects
Query: page, limit, status, search
Response: { data: [projects], meta: { pagination } }
```

### Create Project
```
POST /projects
Body: { name, key, description, visibility }
Response: { project }
```

### Get Project
```
GET /projects/:id
Response: { project }
```

### Update Project
```
PATCH /projects/:id
Body: { name, description, status }
Response: { project }
```

### Delete Project
```
DELETE /projects/:id
Response: { message }
```

## Tasks

### List Tasks
```
GET /tasks
Query: projectId, status, priority, assigneeId, search
Response: { data: [tasks], meta: { pagination } }
```

### Create Task
```
POST /tasks
Body: { title, description, projectId, priority, type }
Response: { task }
```

### Get Task Board
```
GET /tasks/board/:projectId
Response: { board: { todo: [], in_progress: [], ... } }
```

### Update Task
```
PATCH /tasks/:id
Body: { status, priority, assigneeId, ... }
Response: { task }
```

## Response Format

### Success
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "status": "fail|error",
  "message": "Error description"
}
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <accessToken>
```

Access tokens expire in 15 minutes. Use refresh token to get new tokens.
