# Next.js + FastAPI Boilerplate

A production-ready full-stack boilerplate featuring **Next.js 16** frontend and **FastAPI** backend with built-in authentication, encryption, rate limiting, and dual database support.

## Features

- **Authentication System**
  - JWT-based authentication for user sessions
  - API Key/Secret authentication for external clients
  - NextAuth v5 integration with credentials provider
  - Encrypted credential transmission (AES-256-CBC)
  - Password hashing with bcrypt

- **Role-Based Access Control (RBAC)**
  - Three user roles: `admin`, `user`, `guest`
  - Role embedded in JWT tokens for stateless authorization
  - Centralized route configuration with role requirements
  - Client-side route guards with automatic redirects
  - Conditional UI rendering based on user role
  - Default role assignment on registration (`guest`)

- **Dual Database Support**
  - SQLite (default) - zero configuration required
  - MongoDB - optional, async with Motor driver

- **Security**
  - End-to-end encryption for auth payloads
  - Rate limiting per user type (60/min users, 100/min API clients)
  - CORS middleware configured
  - JWT tokens with expiration

- **API Client Management**
  - Create/revoke API credentials
  - Separate rate limits for API clients
  - Track client usage

- **Modern Stack**
  - Next.js 16 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - FastAPI with async support
  - Pydantic v2 validation

## Project Structure

```
nextapi/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application & routes
│   ├── auth.py             # JWT & API key authentication
│   ├── models.py           # SQLAlchemy models
│   ├── models_mongo.py     # MongoDB models
│   ├── database.py         # SQLite configuration
│   ├── database_mongo.py   # MongoDB configuration
│   ├── schemas.py          # Pydantic schemas
│   ├── crypto_utils.py     # AES decryption utilities
│   ├── config.py           # Database type selection
│   ├── rate_limiter.py     # Rate limiting logic
│   └── pyproject.toml      # Python dependencies
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── home/          # Dashboard (protected)
│   │   ├── admin/         # Admin panel (admin only)
│   │   ├── guest/         # Guest page (guest, admin)
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── api/           # API routes & NextAuth
│   ├── config/            # Configuration
│   │   └── routes.ts      # RBAC route definitions
│   ├── lib/               # Utilities
│   │   ├── crypto.ts      # Client-side encryption
│   │   └── crypto-server.ts # Server-side encryption
│   ├── types/             # TypeScript definitions
│   └── auth.ts            # NextAuth configuration
└── package.json           # Root scripts
```

## Prerequisites

- **Node.js** 18+
- **Python** 3.12+
- **uv** (Python package manager) - [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- **MongoDB** (optional) - only if using MongoDB instead of SQLite

## Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nextapi
```

### 2. Install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && uv sync && cd ..
```

### 3. Configure environment variables

#### Backend (`backend/.env`)

```env
# Encryption key for payload encryption (32 bytes hex)
ENCRYPTION_KEY=your-32-byte-hex-key-here

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Rate Limiting (requests per minute)
RATE_LIMIT_USER=60
RATE_LIMIT_API_CLIENT=100

# Database Configuration (optional)
DATABASE_TYPE=sqlite                    # or "mongo"
MONGO_URL=mongodb://localhost:27017     # if using MongoDB
MONGO_DB_NAME=your_database_name        # if using MongoDB
```

#### Frontend (`frontend/.env.local`)

```env
# NextAuth secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your-nextauth-secret-here

# NextAuth URL
AUTH_URL=http://localhost:3000

# Encryption key (MUST match backend ENCRYPTION_KEY)
NEXT_PUBLIC_ENCRYPTION_KEY=your-32-byte-hex-key-here
```

### 4. Generate encryption keys

```bash
# Generate a 32-byte hex key for encryption
openssl rand -hex 32

# Generate a base64 secret for NextAuth
openssl rand -base64 32
```

**Important:** The `ENCRYPTION_KEY` (backend) and `NEXT_PUBLIC_ENCRYPTION_KEY` (frontend) must be identical for encrypted communication to work.

### 5. Run the development server

```bash
# From the root directory - runs both frontend and backend
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |

### Protected Endpoints

Requires JWT Bearer token OR API Key/Secret headers.

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/health` | Health check | 60/min (user), 100/min (API) |
| GET | `/get_user_details` | Get authenticated user details | 60/min (user), 100/min (API) |

### API Client Management

Requires JWT Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api-clients` | Create new API client |
| GET | `/api-clients` | List your API clients |
| DELETE | `/api-clients/{client_id}` | Revoke an API client |

## Authentication

### JWT Authentication (Users)

```bash
# Login to get token
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"data": "<encrypted-payload>"}'

# Use token in requests
curl http://localhost:8000/health \
  -H "Authorization: Bearer <your-jwt-token>"
```

### API Key Authentication (External Clients)

```bash
# Create API client (requires JWT)
curl -X POST http://localhost:8000/api-clients \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My App"}'

# Use API credentials
curl http://localhost:8000/health \
  -H "X-API-Key: <client-id>" \
  -H "X-API-Secret: <client-secret>"
```

## Database Configuration

### SQLite (Default)

No configuration needed. The database file (`app.db`) is created automatically.

### MongoDB

1. Set environment variables in `backend/.env`:
   ```env
   DATABASE_TYPE=mongo
   MONGO_URL=mongodb://localhost:27017
   MONGO_DB_NAME=your_database
   ```

2. Ensure MongoDB is running on your system.

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENCRYPTION_KEY` | Yes | - | 32-byte hex key for AES encryption |
| `JWT_SECRET_KEY` | Yes | - | Secret key for JWT signing |
| `JWT_ALGORITHM` | No | `HS256` | JWT algorithm |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | Token expiration time |
| `RATE_LIMIT_USER` | No | `60` | User requests per minute |
| `RATE_LIMIT_API_CLIENT` | No | `100` | API client requests per minute |
| `DATABASE_TYPE` | No | `sqlite` | Database type (`sqlite` or `mongo`) |
| `MONGO_URL` | No | `mongodb://localhost:27017` | MongoDB connection URL |
| `MONGO_DB_NAME` | No | `learning_scheduler` | MongoDB database name |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | NextAuth.js secret for session encryption |
| `AUTH_URL` | Yes | Base URL of your application |
| `NEXT_PUBLIC_ENCRYPTION_KEY` | Yes | Must match backend `ENCRYPTION_KEY` |

## Scripts

### Root

```bash
npm run dev    # Run frontend + backend concurrently
npm run api    # Run backend only
```

### Frontend (`frontend/`)

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
npm run lint   # Run ESLint
```

### Backend (`backend/`)

```bash
uv run uvicorn main:app --reload  # Development server
uv run uvicorn main:app           # Production server
```

## Tech Stack

### Frontend
- Next.js 16.1.4
- React 19.2.3
- NextAuth 5.0.0-beta
- TypeScript 5
- Tailwind CSS 4
- crypto-js (client-side encryption)

### Backend
- FastAPI 0.128+
- SQLAlchemy 2.0+
- Motor 3.7+ (MongoDB async driver)
- Pydantic 2.0+
- python-jose (JWT)
- bcrypt (password hashing)
- PyCryptodome (AES encryption)
- slowapi (rate limiting)

## Role-Based Access Control

### User Roles

| Role | Description |
|------|-------------|
| `admin` | Full access to all routes and features |
| `user` | Standard authenticated user access |
| `guest` | Limited access (default role for new users) |

### Protected Routes

| Route | Allowed Roles | Description |
|-------|---------------|-------------|
| `/home` | admin, user, guest | Main dashboard |
| `/admin` | admin | Admin panel |
| `/guest` | admin, guest | Guest-specific page |

### How RBAC Works

1. **Registration**: New users are assigned the `guest` role by default
2. **Authentication**: User role is embedded in the JWT token
3. **Route Protection**: Frontend checks user role before rendering protected pages
4. **Unauthorized Access**: Users are redirected to dashboard if they lack permissions

### Configuration

Routes and role requirements are defined in `frontend/config/routes.ts`:

```typescript
export const ProtectedRoutes: ProtectedRoute[] = [
  { path: '/home', label: 'Dashboard', allowedRoles: ['admin', 'guest', 'user'] },
  { path: '/admin', label: 'Admin Panel', allowedRoles: ['admin'] },
  { path: '/guest', label: 'Guest Page', allowedRoles: ['guest', 'admin'] },
];
```

### Helper Functions

```typescript
import { hasAccess, getAccessibleRoutes, canAccessPath } from '@/config/routes';

// Check if user has a specific role
hasAccess('user', ['admin', 'user']); // true

// Get all routes accessible to a user
getAccessibleRoutes('guest'); // Returns routes for guest role

// Check if user can access a specific path
canAccessPath('admin', '/admin'); // true
```
## Docker

### Single-command start

```bash
# 1. Copy the example env file and fill in your secrets
cp .env.example .env
# Edit .env — set ENCRYPTION_KEY, JWT_SECRET_KEY, AUTH_SECRET, NEXT_PUBLIC_ENCRYPTION_KEY

# 2. Build and start everything
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Environment variables

Create a `.env` file in the project root (next to `docker-compose.yml`). See `.env.example` for all available variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `ENCRYPTION_KEY` | Yes | 32-byte hex key — must match `NEXT_PUBLIC_ENCRYPTION_KEY` in frontend |
| `JWT_SECRET_KEY` | Yes | Secret used to sign JWT tokens |
| `JWT_ALGORITHM` | No | Default: `HS256` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | No | Default: `30` |
| `RATE_LIMIT_USER` | No | Default: `60` (requests/min) |
| `RATE_LIMIT_API_CLIENT` | No | Default: `100` (requests/min) |
| `DATABASE_TYPE` | No | `sqlite` (default) or `mongo` |
| `MONGO_URI` | Only if mongo | Full MongoDB connection URI |

Generate secrets:
```bash
openssl rand -hex 32   # ENCRYPTION_KEY / JWT_SECRET_KEY
```

### MongoDB with Docker

```bash
DATABASE_TYPE=mongo MONGO_URI=mongodb://user:pass@host:27017/dbname docker compose up --build
```

### SQLite persistence

The SQLite database (`app.db`) is stored in a named Docker volume (`backend_data`) and survives container restarts.

### SSL with nginx (local/self-signed certs)

nginx is optional and only starts when the `ssl` profile is active.

1. Drop your cert and key into `nginx/certs/`:
   ```
   nginx/certs/cert.pem
   nginx/certs/key.pem
   ```
   Generate a self-signed cert for local use:
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout nginx/certs/key.pem \
     -out nginx/certs/cert.pem -days 365 -nodes \
     -subj "/CN=localhost"
   ```

2. Start with the ssl profile:
   ```bash
   docker compose --profile ssl up --build
   ```

- HTTPS: https://localhost (proxies to frontend)
- HTTP redirects to HTTPS automatically
- Edit `nginx/nginx.conf` to change `server_name` for non-localhost domains

### Stopping

```bash
docker compose down          # stop containers
docker compose down -v       # stop + delete the SQLite volume
```

---

## To Do
 - make the template PWA ready.

## License

MIT

## Contact

For questions or feedback, please contact:

    Name:   Mohammed Khan.
    Email:  mkhan@live.co.za
    GitHub: sup3rus3r
