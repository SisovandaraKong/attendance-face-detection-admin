# Attendance Face Detection Admin (Next.js)

This app is the admin portal for the face-attendance system.

It consumes data from the FastAPI backend in the sibling project:
- FastAPI backend: `attendance-face-detection`
- Next.js admin: `attendance-face-detection-admin`

## Features

- Dashboard KPIs, weekly summary, and live recognition stream
- Attendance history with date filters
- Enrolled persons and dataset completeness overview
- API-first architecture with server-side fetching

## Tech Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4

## Project Structure

- `app/(admin)/dashboard` dashboard page
- `app/(admin)/attendance` attendance records page
- `app/(admin)/persons` persons page
- `components/admin` shared layout components
- `lib/api.ts` API client helpers
- `lib/types.ts` shared API response types

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Default:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8168
```

If backend runs on another host or port, update this value.

## Run

1. Start FastAPI backend first (`attendance-face-detection`) on port `8168`
2. Start admin app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build for Production

```bash
npm run build
npm run start
```

## API Endpoints Used

- `/api/admin/dashboard/summary`
- `/api/admin/attendance/records`
- `/api/admin/attendance/dates`
- `/api/admin/persons/list`
- `/api/admin/persons/stats`

## Fullstack Local Workflow

Run both apps in separate terminals:

1. Backend terminal:

```bash
cd ../attendance-face-detection
uvicorn main:app --reload --host 0.0.0.0 --port 8168
```

2. Admin terminal:

```bash
npm run dev
```

Then open:
- Admin UI: `http://localhost:3000`
- Backend API docs: `http://127.0.0.1:8168/docs`

## Troubleshooting

- API request failures in admin:
	- Check backend is running
	- Verify `NEXT_PUBLIC_API_BASE_URL`
- CORS errors:
	- Set backend `ADMIN_ORIGIN=http://localhost:3000`
- Empty dashboard data:
	- Ensure backend has generated logs and model artifacts
