# 📊 Student Performance Tracker

Student Performance Tracker is a full-stack web platform that helps schools monitor student outcomes, collect two-way feedback, and keep administrators, teachers, and students aligned. The solution pairs a .NET 9 API with a Vite + React dashboard and follows a clean architecture backend (data → services → repositories → controllers) to keep business logic isolated and testable.

## 👥 Personas & Key Features
- **🎓 Students**
  - View current grades and enrollment (`Grade`, `StudentSubjects` components).
  - Submit course feedback once an instructor has provided remarks (`GradeFeedbackController`, `StudentService`).
  - Download PDF summaries shared by admins.
- **👨‍🏫 Teachers**
  - Manage assigned courses (`CourseController`, `TeacherService`).
  - Grade students and attach qualitative feedback for each course (`TeacherController`, `GradeFeedbackService`).
  - Monitor personal dashboard stats (courses taught, student counts).
- **👔 Administrators**
  - Full RBAC user management: invite, update, soft-delete, and fetch recent users (`AdminController`, `AdminService`).
  - Assign teachers to courses and oversee enrollment pipelines.
  - Export dashboard and grade summaries as PDFs (`PdfController`, frontend `ExportPDFDropdown`).
- **🔗 Shared**
  - 🔐 JWT authentication with role-based authorization (`AuthController`, `ProtectedRoute` / `GuestRoute`).
  - 📝 Serilog-based structured logging to `backend/ASI.Basecode.WebApp/App_Data/logs`.

## 🏗️ Architecture & Stack
### 🔧 Backend (Clean Architecture)
- `backend/ASI.Basecode.Data` 📦
  - Entity Framework Core models (`Models/`), SQLite/SQL Server DbContext, repositories (`Repositories/`) with generic CRUD helpers, and EF Unit of Work abstractions.
  - Database migrations under `Migrations/` (Initial schema, soft delete support).
- `backend/ASI.Basecode.Services` ⚙️
  - DTOs in `ServiceModels/`, service interfaces/implementations encapsulating business logic (user onboarding, RBAC, PDF rendering, grade workflows).
  - Shared mapping utilities (`Utils/DtoMapper`), response helpers, and security services (JWT, RBAC).
- `backend/ASI.Basecode.WebApp` 🌐
  - ASP.NET Core 9 Web API layer exposing controllers for authentication, admin, teacher, course, student-course, feedback, and PDF flows.
  - Startup files configure dependency injection, AutoMapper, JWT auth, Serilog, and Swagger (`Startup.*.cs`).

### 🎨 Frontend
- `frontend/` is a Vite + React 19 project with TypeScript, Tailwind CSS, and TanStack Table for data grids.
- `src/components/` organizes UI widgets by domain (auth, dashboard, admin/teacher/student areas, PDF export controls).
- `src/services/` centralizes API calls via axios instances defined in `src/lib/api.ts`, automatically injecting JWTs from `sessionStorage`.
- Routing and access control use React Router + role-aware guards (`GuestRoute`, `ProtectedRoute`).

### 🔄 Cross-Cutting Concerns
- **🔐 Authentication**: `/api/auth/login` issues JWTs signed with the `TokenAuthentication` secret; tokens are stored in `sessionStorage` on the client.
- **📝 Logging**: Serilog writes rolling files and supports Seq integration if configured.
- **📄 PDF generation**: `IPdfService` composes dashboard/course summaries for administrators and teachers.

## 🛣️ API Routes

All routes are prefixed with `/api` unless otherwise noted. Most endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### 🔐 Authentication (`/api/auth`)
- `🔵 POST /api/auth/login` - Authenticate user and receive JWT token
- `🟢 POST /api/auth/register` - Register a new user (typically students)
- `📥 GET /api/auth/me` - Get current authenticated user profile
- `✏️ PUT /api/auth/me/update` - Update current user's profile

### 👔 Admin (`/api/admin`)
**👥 User Management:**
- `➕ POST /api/admin/user/create/` - Create new user (Admin only)
- `📋 GET /api/admin/user` - Get all users
- `🔍 GET /api/admin/user/{userId}` - Get specific user by ID
- `🕐 GET /api/admin/user/recent?count={n}` - Get recent users (default: 5)
- `👤 GET /api/admin/getUsersByRole?role={role}` - Get users by role (Student/Teacher/Admin)
- `✏️ PUT /api/admin/user/update/{userId}` - Update user
- `🗑️ DELETE /api/admin/user/delete/{userId}` - Soft delete user

**📚 Course Management:**
- `🔗 PUT /api/admin/course/assign-teacher/{courseId}?teacherId={id}` - Assign teacher to course

**📊 Dashboard & Reports:**
- `📈 GET /api/admin/dashboard-stats` - Get dashboard statistics (user counts, course totals)
- `📄 GET /api/admin/pdf/dashboard-summary?role={role}` - Export dashboard PDF (optional role filter)
- `📑 GET /api/admin/pdf/course-grade-summary` - Export course grade summary PDF
- `📊 GET /api/admin/pdf/grades-per-course?courseCode={code}` - Export grades for specific course

### 📚 Course (`/api/course`)
- `📋 GET /api/course/list` - Get all courses (Admin only)
- `🔍 GET /api/course/{courseId}` - Get course by ID
- `🔍 GET /api/course/code/{courseCode}` - Get course by course code
- `➕ POST /api/course/add` - Create new course (Admin only)
- `✏️ PUT /api/course/update` - Update course (Admin only)
- `🗑️ DELETE /api/course/delete/{courseId}` - Delete course by ID (Admin only)
- `🗑️ DELETE /api/course/delete/code/{courseCode}` - Delete course by code (Admin only)

### 👨‍🏫 Teacher (`/api/teacher`)
- `📚 GET /api/teacher/my-courses` - Get courses assigned to current teacher
- `📊 GET /api/teacher/dashboard-stats` - Get teacher dashboard statistics
- `💬 GET /api/teacher/my-feedback` - Get all feedback given by current teacher

### 🎓 Student Course (`/api/student-course`)
- `➕ POST /api/student-course/enroll` - Enroll student in course (Admin only)
- `✏️ PUT /api/student-course/update` - Update student grade (Teacher only)
- `🗑️ DELETE /api/student-course/delete?studentUserId={id}&courseCode={code}` - Unenroll student (Admin only)
- `📋 GET /api/student-course/student/{studentUserId}` - Get all courses for a student (Student/Teacher/Admin)
- `👥 GET /api/student-course/course/{courseCode}` - Get all students in a course (Admin/Teacher)
- `📋 GET /api/student-course/all` - Get all enrollments (Admin only)

### 💬 Grade Feedback (`/api/feedback`)
**🎓 Student Routes:**
- `➕ POST /api/feedback/student/create` - Submit student feedback for a course
- `📥 GET /api/feedback/student/{studentUserId}/course/{courseCode}` - Get feedback for student's course
- `✅ GET /api/feedback/student/exists/student/{studentUserId}/course/{courseCode}` - Check if student feedback exists

**👨‍🏫 Teacher Routes:**
- `➕ POST /api/feedback/create` - Create teacher feedback for a student
- `✏️ PUT /api/feedback/update/{feedbackId}` - Update feedback (Teacher only, own feedback)
- `🗑️ DELETE /api/feedback/delete/{feedbackId}` - Delete feedback (Teacher only, own feedback)

**🔍 General Routes:**
- `📋 GET /api/feedback/all` - Get all feedback (Admin/Teacher)
- `🔍 GET /api/feedback/{feedbackId}` - Get specific feedback by ID
- `✅ GET /api/feedback/exists/student/{studentUserId}/course/{courseCode}` - Check if teacher feedback exists

### 📄 PDF (`/pdf`)
- `🧪 GET /pdf/test` - Generate test PDF (for development)

## 📋 Prerequisites
- [.NET SDK 9.0](https://dotnet.microsoft.com/download) 🔵
- Node.js 20+ and npm 10+ 🟢
- SQL Server LocalDB (default) or SQLite (file `backend/ASI.Basecode.Data/db.sqlite`) 🗄️
- Optional: [Seq](https://datalust.co/seq) if you want centralized log aggregation 📊
- `dotnet-ef` CLI (`dotnet tool install --global dotnet-ef`) for running migrations locally 🔧

## 🚀 Initial Setup
### 1️⃣ Clone & Restore
```bash
git clone <repo-url>
cd Student-Performance-Tracker
dotnet restore Student-Performance-Tracker.sln
cd frontend && npm install && cd ..
```

### 2️⃣ Configure Backend
1. Copy `backend/ASI.Basecode.WebApp/appsettings.json` (and `.Development`) and update:
   - `ConnectionStrings:DefaultConnection`
   - `TokenAuthentication` secret/audience if needed.
2. (Optional SQLite) Point the connection string to `Data Source=backend/ASI.Basecode.Data/db.sqlite`.
3. Apply migrations from the WebApp project root:
   ```bash
   cd backend/ASI.Basecode.WebApp
   dotnet ef database update --project ../ASI.Basecode.Data --startup-project .
   cd ../../..
   ```

### 3️⃣ Configure Frontend
1. Edit `frontend/src/lib/api.ts` and set `baseUrl` to your backend URL (e.g., `https://localhost:5001` when running behind HTTPS).
2. Confirm the exposed API path (`/api`) matches the backend routing configuration.

### 4️⃣ Run the Apps
```bash
# Backend (watch mode)
dotnet watch run --project backend/ASI.Basecode.WebApp/ASI.Basecode.WebApp.csproj

# Frontend
cd frontend
npm run dev
```
The React app defaults to `http://localhost:5173`. Ensure CORS allows this origin (configured in `Startup.cs`).

## 🛠️ Developer Workflow & Troubleshooting
- **🔨 Build & lint**
  - Backend: `dotnet build Student-Performance-Tracker.sln`
  - Frontend: `npm run lint` and `npm run build`
- **🗄️ Migrations**
  ```bash
  dotnet ef migrations add <Name> \
    --project backend/ASI.Basecode.Data \
    --startup-project backend/ASI.Basecode.WebApp
  dotnet ef database update
  ```
  Remove the last migration with `dotnet ef migrations remove` if needed.
- **📝 Logs**
  - Backend logs write to `backend/ASI.Basecode.WebApp/App_Data/logs`. Check these when APIs fail silently.
- **⚠️ Common issues**
  - *🔌 Port mismatch*: Align the Vite `baseUrl` with the ASP.NET port shown during startup.
  - *🗄️ Database connection errors*: Ensure LocalDB is installed or switch to SQLite.
  - *🔐 JWT validation failures*: Delete `sessionStorage.accessToken` and log in again if tokens expire or the signing key changes.
- **📄 PDF Exports**
  - Admin endpoints (`/api/admin/pdf/dashboard-summary`, `/api/admin/pdf/course-grade-summary`) power the `ExportPDFDropdown` component; ensure your browser allows downloading blobs.

## 🧪 Testing & Swagger with Role-Based Tokens
1. 🚀 Start the backend (`dotnet run` or `dotnet watch run`).
2. 🌐 Navigate to Swagger UI at `https://localhost:<port>/swagger`.
3. 🔑 Obtain a JWT:
   - Expand `POST /api/auth/login`.
   - Provide credentials for the role you want to test (create them via `/api/auth/register` or admin endpoints).
   - Execute the request and copy the `token` value from the response.
4. ✅ Click the **Authorize** button (top-right of Swagger), paste `Bearer <token>` (including the `Bearer` prefix), and click **Authorize**.
5. 🎯 Invoke protected endpoints:
   - **👔 Admin**: `/api/admin/user/...`, `/api/admin/dashboard-stats`, `/api/admin/pdf/...`
   - **👨‍🏫 Teacher**: `/api/teacher/my-courses`, `/api/teacher/my-feedback`
   - **🎓 Student**: `/api/student-course/student/{userId}`, `/api/feedback/student/...`
6. 🔄 To switch roles, click **Authorize → Logout**, then repeat with a token issued for the desired role.

### 🖥️ Manual Frontend Verification
1. 🔐 Log in through the React UI (`http://localhost:5173/login`).
2. ✅ Use the dashboards to confirm:
   - 🎓 Student can submit feedback and view grades after providing evaluations.
   - 👨‍🏫 Teacher views assigned courses, updates grades, and leaves feedback.
   - 👔 Admin manages users, assigns teachers, and exports PDFs.

## 📚 Useful Commands Reference
```bash
# 🔄 Restore everything
dotnet restore Student-Performance-Tracker.sln

# 🔧 Backend run/build
dotnet watch run --project backend/ASI.Basecode.WebApp
dotnet build backend/ASI.Basecode.WebApp/ASI.Basecode.WebApp.csproj

# 🎨 Frontend
cd frontend && npm run dev
cd frontend && npm run build

# 🔗 Axios base URL quick edit
sed -i 's|http://localhost:54927|https://localhost:5001|' frontend/src/lib/api.ts
```

With this workflow you can stand up the API, connect the Vite frontend, exercise every role via Swagger, and iterate safely thanks to the layered architecture. Happy hacking! 🚀