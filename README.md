# Task & Team Management

w   qw

## 🚀 Features

- **User Authentication**: JWT-based auth with access/refresh token pattern
- **Projects**: Create and manage projects with team members
- **Tasks**: Full task management with Kanban board view
- **Comments**: Task discussions with reactions
- **Labels**: Categorize tasks with colored labels
- **Activity Logs**: Track all actions for audit trail
- **Role-Based Access**: Admin, Member, Viewer roles

## 🛠 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation
- Winston Logging
- Jest + Supertest

### Frontend
- React 18 + Vite
- React Router
- Axios
- CSS Variables Design System

## 📦 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── modules/       # Feature modules
│   │   ├── routes/        # Route aggregation
│   │   ├── utils/         # Utilities
│   │   ├── docs/          # Swagger spec
│   │   └── scripts/       # Seed scripts
│   └── tests/             # Test files
├── frontend/
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── context/       # React context
│       └── services/      # API services
└── docs/                  # Documentation
```

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd sample-project

# Install dependencies
npm install

# Copy environment file
cp backend/.env.example backend/.env
# Edit .env with your values

# Start MongoDB (if not running)
mongod

# Seed database
npm run seed

# Start development
npm run dev
```

### Using Docker

```bash
docker-compose up
```

## 🔑 Demo Credentials

| Role   | Email                    | Password      |
|--------|--------------------------|---------------|
| Admin  | admin@example.com        | Admin123!     |
| Member | john.doe@example.com     | JohnDoe123!   |
| Member | jane.smith@example.com   | JaneSmith123! |
| Viewer | bob.wilson@example.com   | BobWilson123! |

## 📚 API Documentation

API documentation is available at `http://localhost:5000/api-docs` when running the backend.

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests with coverage
cd backend && npm run test:coverage

# Frontend tests
cd frontend && npm test
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build both apps |
| `npm run seed` | Seed database with demo data |
| `npm test` | Run all tests |
| `npm run lint` | Lint all code |

## 📄 License

MIT
