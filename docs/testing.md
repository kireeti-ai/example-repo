# Testing Strategy

## Overview

The project uses a multi-layered testing approach:
- Unit tests for utilities and services
- Integration tests for API endpoints
- Component tests for React components

## Backend Testing

### Tools
- **Jest**: Test runner
- **Supertest**: HTTP assertions
- **mongodb-memory-server**: In-memory MongoDB

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── setup.js           # Global setup
├── integration/
│   ├── auth.test.js   # Auth API tests
│   ├── projects.test.js
│   └── tasks.test.js
└── unit/              # Unit tests
```

### Example Test

```javascript
describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', password: 'Test123!' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });
});
```

## Frontend Testing

### Tools
- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **jsdom**: DOM environment

### Running Tests

```bash
cd frontend

# Run tests
npm test

# Watch mode
npm run test:watch
```

## CI/CD

Tests run automatically on:
- Pull requests to main
- Pushes to main

GitHub Actions workflow includes:
1. Lint check
2. Backend tests
3. Frontend build
4. Docker build

## Coverage Goals

- Backend: 80%+ coverage
- Frontend: 70%+ coverage
