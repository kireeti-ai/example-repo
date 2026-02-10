# Architecture Overview

## System Architecture

The application follows a monorepo structure with separate frontend and backend applications.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React SPA     │───▶│   Express API   │───▶│    MongoDB      │
│   (Vite)        │    │   (Node.js)     │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Backend Architecture

### Layered Design

```
Routes → Controllers → Services → Repositories → Models
```

- **Routes**: Define endpoints and apply middleware
- **Controllers**: Handle HTTP request/response
- **Services**: Business logic
- **Repositories**: Data access layer
- **Models**: Mongoose schemas

### Modules

Each feature is organized into modules:
- `auth` - Authentication
- `users` - User management
- `projects` - Project CRUD
- `tasks` - Task management
- `comments` - Comments/reactions
- `labels` - Label management
- `activity` - Activity logging

### Middleware Pipeline

```
Request → RequestLogger → RateLimit → Auth → RBAC → Validate → Handler → ErrorHandler → Response
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/    # Reusable UI components
│   └── auth/      # Auth-specific components
├── pages/         # Route pages
├── context/       # React context providers
└── services/      # API client services
```

### State Management

- React Context for auth state
- Local component state for UI
- API service layer for data fetching

## Security

- JWT access/refresh token pattern
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- MongoDB query sanitization
- CORS configuration
