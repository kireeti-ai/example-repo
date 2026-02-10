# Security

## Authentication

### JWT Token Pattern
- **Access Token**: 15-minute expiry, sent in Authorization header
- **Refresh Token**: 7-day expiry, stored securely, rotated on use

### Password Requirements
- Minimum 8 characters
- Hashed with bcrypt (10 rounds)

## Authorization

### Role-Based Access Control (RBAC)

| Role   | Capabilities |
|--------|--------------|
| Admin  | Full system access, user management |
| Member | Create/edit own content, view team content |
| Viewer | Read-only access |

### Project-Level Roles
- **Owner**: Full project control
- **Admin**: Manage members, settings
- **Member**: Create/edit tasks
- **Viewer**: Read-only

## Security Headers

Using Helmet middleware:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables

## Input Validation

- Joi schema validation on all inputs
- MongoDB query sanitization
- XSS prevention

## Secrets Management

- All secrets via environment variables
- No hardcoded credentials
- .env.example provided (no real values)

## Threat Model

### Mitigated Threats
1. **Brute Force**: Rate limiting, account lockout
2. **XSS**: Input sanitization, CSP headers
3. **CSRF**: Token-based auth, SameSite cookies
4. **Injection**: Query sanitization, parameterized queries
5. **Token Theft**: Short expiry, HTTPS only
