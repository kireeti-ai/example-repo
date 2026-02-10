# Data Model

## Entity Relationship Diagram

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│ Project │────▶│  Task   │
└─────────┘     └─────────┘     └─────────┘
     │               │               │
     │               │               ▼
     │               │          ┌─────────┐
     │               │          │ Comment │
     │               │          └─────────┘
     │               │               │
     ▼               ▼               ▼
┌─────────────────────────────────────────┐
│              Activity Log               │
└─────────────────────────────────────────┘
```

## Models

### User
- `email`: Unique email address
- `password`: Hashed password
- `firstName`, `lastName`: User name
- `role`: admin | member | viewer
- `isActive`: Account status
- `refreshToken`: For token refresh

### Project
- `name`: Project name
- `key`: Unique identifier (e.g., "PROJ")
- `owner`: User reference
- `members[]`: Array of {user, role, joinedAt}
- `status`: active | archived | completed
- `visibility`: private | public
- `taskCount`: Aggregated count

### Task
- `title`, `description`: Task content
- `taskNumber`: Auto-generated (e.g., "PROJ-1")
- `project`: Project reference
- `assignee`, `reporter`: User references
- `status`: backlog | todo | in_progress | in_review | done | cancelled
- `priority`: low | medium | high | urgent
- `type`: task | bug | feature | improvement | epic | story
- `labels[]`: Label references
- `dueDate`, `estimatedHours`, `actualHours`
- `parentTask`: For subtasks

### Comment
- `content`: Comment text
- `task`: Task reference
- `author`: User reference
- `parentComment`: For replies
- `reactions[]`: {user, emoji}
- `mentions[]`: User references

### Label
- `name`, `color`, `description`
- `project`: Null for global labels
- `isArchived`: Soft delete

### Activity
- `action`: Action type
- `actor`: User who performed action
- `entityType`, `entityId`: Target entity
- `changes`: {before, after}
- `metadata`: Additional context
