# Architectural Patterns

## 1. Feature Module Pattern (Backend)

Mỗi tính năng là một NestJS module độc lập trong `fly-labour-backend/src/modules/`. Mỗi module gồm:
- `*.entity.ts` — TypeORM entity (map DB table)
- `*.controller.ts` — HTTP route handlers
- `*.service.ts` — Business logic
- `dto/` — Input validation với class-validator

Ví dụ: `modules/jobs/` có `job.entity.ts`, `jobs.controller.ts`, `jobs.service.ts`, `dto/job.dto.ts`.

## 2. Role-Based Guard Chain

Guards áp dụng theo thứ tự trên controller/route:
```
@UseGuards(JwtAuthGuard, AdminGuard)   → chỉ admin
@UseGuards(JwtAuthGuard, EmployerGuard) → chỉ employer
@UseGuards(JwtAuthGuard)               → bất kỳ user đăng nhập
// không có guard                       → public endpoint
```
Xem: `fly-labour-backend/src/common/guards/`

## 3. Single API Service (Frontend)

Toàn bộ API call tập trung trong một file: `fly-labour-frontend/src/services/api.ts`.
- Một Axios instance duy nhất với JWT interceptor
- Các endpoint nhóm theo tên object: `jobsApi`, `authApi`, `applicationsApi`, v.v.
- 401 response → auto logout và redirect `/login`

## 4. Zustand Store + localStorage Persistence

`fly-labour-frontend/src/store/authStore.ts` dùng Zustand + persist middleware.
- State persist vào localStorage key `fly-labour-auth`
- Axios interceptor đọc trực tiếp từ localStorage (không qua store) để gắn token
- Pattern: store chứa `user`, `token`, `isAuthenticated` + action methods

## 5. Role-Scoped Pages

Pages trong frontend chia theo role, mỗi role có layout riêng:
- `pages/user/` — public và job seeker pages
- `pages/employer/` + `EmployerLayout.tsx` — employer dashboard
- `pages/admin/` + `AdminLayout.tsx` + `AdminSidebar.tsx` — admin panel

## 6. DTO Validation Pattern (Backend)

Tất cả input từ client được validate qua class-validator DTO trước khi vào service.
NestJS `ValidationPipe` áp dụng global trong `main.ts`.

## 7. GCS File Upload Flow

Upload file đi qua `modules/upload/` → `common/services/gcs.module.ts` → Google Cloud Storage.
File upload dùng `multipart/form-data`. URL của file trả về và lưu vào DB field của entity liên quan.

## 8. i18n Translation Hook

`fly-labour-frontend/src/hooks/useT.ts` cung cấp translation function.
Translation strings trong `fly-labour-frontend/src/i18n/translations.ts`.
Current language state quản lý bởi `store/langStore.ts`.

## 9. TanStack React Query for Server State

Server-side data (jobs, applications, v.v.) được fetch và cache bởi React Query.
Local UI state (form, modal open/close) dùng `useState`.
Global persistent state (auth, language) dùng Zustand.
