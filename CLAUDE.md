# Fly Labour — Project Guide

## Purpose

Nền tảng tuyển dụng lao động quốc tế (Úc, Canada, New Zealand). Kết nối người tìm việc, nhà tuyển dụng, và admin quản lý hệ thống.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + TypeScript + Vite            |
| Styling    | Tailwind CSS 3                          |
| State      | Zustand 4 (persist to localStorage)     |
| Data fetch | TanStack React Query 5 + Axios          |
| Routing    | React Router DOM 6                      |
| Backend    | NestJS 10 + TypeScript                  |
| Database   | PostgreSQL 16 + TypeORM 0.3             |
| Auth       | Passport.js + JWT                       |
| Storage    | Google Cloud Storage (file uploads)     |
| Container  | Docker Compose (postgres + api + web)   |

## Key Directories

```
fly-labour-backend/src/
  modules/          # Feature modules: auth, users, jobs, applications, categories, news, contact, settings, upload
  common/guards/    # JwtAuthGuard, AdminGuard, EmployerGuard
  common/services/  # GCS upload service
  database/         # Migration scripts and seeds
  config/           # Database and app configuration

fly-labour-frontend/src/
  pages/            # Route-level pages (user/, employer/, admin/ sub-folders by role)
  components/       # Reusable UI (admin/, home/, jobs/, layout/, ui/)
  services/api.ts   # Single Axios instance + all API endpoint functions
  store/            # Zustand stores: authStore, langStore
  types/index.ts    # Shared TypeScript interfaces
  i18n/             # Vietnamese/English translations
  hooks/useT.ts     # Translation hook
```

## User Roles

- `admin` — full access
- `employer` — manage own job posts and view applications
- `user` — apply for jobs, manage own profile

## Build & Run Commands

### Backend
```bash
cd fly-labour-backend
npm run start:dev          # Development (watch mode)
npm run build              # Production build
npm run start:prod         # Run production build
npm run migration:run      # Apply DB migrations
npm run migration:revert   # Rollback last migration
```

### Frontend
```bash
cd fly-labour-frontend
npm run dev                # Development server (Vite)
npm run build              # TypeScript check + Vite build
npm run preview            # Preview production build
```

### Docker (full stack)
```bash
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
```

## Environment Variables

- Backend: `fly-labour-backend/.env` — DB credentials, JWT_SECRET, PORT, GCS config
- Frontend: `VITE_API_URL` — backend base URL (defaults to `http://localhost:3000`)

## API Pattern

All endpoints under `/auth`, `/jobs`, `/applications`, `/users`, `/categories`, `/news`, `/contact`, `/settings`, `/upload`.
Auth: `Authorization: Bearer <JWT>` header injected automatically by Axios interceptor.
See `fly-labour-frontend/src/services/api.ts:1` for all endpoint definitions.

## Additional Documentation

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — module structure, guards, state management, API conventions
- [Real-time Sync Options](.claude/docs/realtime_sync_options.md) — 3 options for syncing chore changes across browser tabs/clients (Vietnamese)
