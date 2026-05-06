# Content Broadcasting System

A full-stack content broadcasting platform for educational environments. Teachers upload subject-based content, principals approve or reject it, and students view live broadcasts on public display pages.

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **React Hook Form** + **Zod** for form validation
- **Axios** for API calls
- **React Router v7** for routing
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with **Express**
- **Supabase** (PostgreSQL) for database
- **Multer** for file uploads
- **JWT** for authentication

## Project Structure

```
content-broadcasting-system/
├── frontend/           # React + Vite application
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/      # Route-specific pages
│       ├── layouts/    # Layout wrappers
│       ├── services/   # API service layer
│       ├── hooks/      # Custom React hooks
│       ├── context/    # React Context providers
│       └── utils/      # Helpers, validators, API config
├── backend/            # Express API server
│   └── src/
│       ├── routes/
│       ├── middleware/
│       └── server.js
└── Frontend-notes.txt  # Detailed frontend documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Backend Setup
1. Navigate to the `backend/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Supabase credentials
4. Start the server:
   ```bash
   npm start
   ```
   Server runs at `http://localhost:5000`

### Frontend Setup
1. Navigate to the `frontend/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

## Features

### Authentication
- Login / Register with role selection (Teacher / Principal)
- JWT-based authentication with token interceptor
- Role-based route protection

### Teacher Dashboard
- Dashboard with stats cards (Total, Pending, Approved, Rejected)
- Upload content with file preview, validation (type, size, scheduling)
- View content status with scheduling indicators (Scheduled / Active / Expired)
- Pagination for large content lists

### Principal Dashboard
- Dashboard with moderation overview stats
- Approve / Reject workflow with mandatory rejection reason
- Search and filter content by status, subject, or keyword
- File preview modal with full metadata

### Public Live Display
- Route: `/live/:teacherId`
- Shows all currently active broadcast content
- Auto-refreshes every 30 seconds
- No authentication required
- Graceful empty/error states

## API Endpoints

### Auth
- `POST /api/auth/register` — `{ name, email, password, role }`
- `POST /api/auth/login` — `{ email, password }`

### Teacher (Protected)
- `POST /api/content/upload` — FormData `{ title, file, subject, description, start_time, end_time, rotation_duration }`
- `GET /api/content/my-content` — View status of own uploads

### Principal (Protected)
- `GET /api/approval/pending` — List all pending content
- `POST /api/approval/status/:contentId` — `{ status, rejection_reason }`
- `GET /api/approval/all` — View all content (with pagination, filters)

### Public
- `GET /api/public/live/:teacherId` — Get currently active content

## Architecture Highlights

- **Service Layer**: All API calls go through `services/*.service.js` — never called directly from components
- **Context Providers**: `AuthContext` for auth state, `ToastContext` for notifications
- **Custom Hooks**: `useAuth`, `useContent`, `useApproval`, `useToast`
- **Reusable Components**: Button, Modal, Card, StatusBadge, FormField, Toast, SkeletonLoader, EmptyState
- **Form Validation**: React Hook Form + Zod schemas with file validation
- **Performance**: React.memo, useMemo, useCallback for optimized rendering
