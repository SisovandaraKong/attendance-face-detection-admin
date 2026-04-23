# Attendance Face Detection Admin (Next.js)

This repository is the administrative frontend for the attendance face-detection ecosystem. It visualizes operational data from the FastAPI backend and provides a structured dashboard for attendance monitoring.

## Abstract

The admin portal translates backend recognition events into actionable interface views: dashboard KPIs, attendance history, and person enrollment status. It follows an API-first architecture, where the UI remains decoupled from recognition logic while consuming backend resources in real time.

## Table of Contents

- Introduction
- Literature Review
- Methodology
- Results
- Discussion
- Conclusion
- System Architecture
- Setup and Installation
- Running the Admin Portal
- API Contract
- Project Structure
- Troubleshooting

## Introduction

Face-recognition attendance systems need a reliable operator interface to inspect events, verify enrollment quality, and evaluate daily trends. This admin app addresses that need by providing clear operational views built on top of backend APIs.

Primary goals:
- Display real-time and historical attendance information.
- Track enrollment and dataset completeness per person.
- Keep frontend architecture maintainable and extensible.

## Literature Review

Admin platforms for intelligent monitoring systems commonly emphasize:

1. API-first separation:
Decoupling UI from model inference improves maintainability, testability, and deployment flexibility.

2. Dashboard observability:
Operational KPIs and trend charts improve decision speed and incident visibility.

3. Human-centered monitoring interfaces:
Simple navigation and concise information hierarchy reduce operator error and cognitive load.

This project follows these principles with a modular Next.js App Router architecture.

## Methodology

### 1. Frontend Architecture

- Next.js App Router with route grouping under `app/(admin)`.
- Shared UI shell using reusable sidebar/topbar components.
- Type-safe API layer in `lib/api.ts` and `lib/types.ts`.

### 2. Data Access Strategy

- Server-side fetching to ensure fresh dashboard data.
- Centralized backend base URL through environment variable.
- Structured handling of API envelope responses (`success`, `data`, `message`).

### 3. Interface Modules

- Dashboard:
	- KPIs (present today, known persons, logged days, model status)
	- Weekly summary
	- Latest recognitions
	- Live stream panel
- Attendance:
	- Date filtering and table view
- Persons:
	- Dataset completeness and progress cards

## Results

Current implementation delivers:
- A responsive admin layout for desktop and mobile.
- Functional pages for dashboard, attendance, and persons.
- Live integration with FastAPI endpoints.
- Runtime configurability via `.env.local`.

Operational outcomes:
- Faster monitoring of daily recognition activity.
- Clear visibility of dataset coverage quality.
- Better separation between ML backend and UI layer.

## Discussion

Strengths:
- Clean separation of concerns (frontend vs inference backend).
- Easy environment-based backend switching.
- Extendable component architecture.

Limitations:
- Depends on backend uptime and API health.
- No client-side auth/role system in the current version.
- Visualization layer currently focuses on core operational metrics.

Potential improvements:
- Add authentication and role-based routes.
- Add richer analytics (weekly/monthly trends, anomalies).
- Add error telemetry and request tracing.

## Conclusion

The admin portal provides a practical, maintainable control interface for the face-attendance backend. It aligns with modern API-first design and supports future expansion toward enterprise-level operational dashboards.

## System Architecture

Fullstack split:
- Backend: `attendance-face-detection` (FastAPI + ML inference)
- Frontend: `attendance-face-detection-admin` (Next.js admin UI)

Backend default URL expected by this app:
- `http://127.0.0.1:8168`

## Setup and Installation

```bash
npm install
cp .env.example .env.local
```

Default environment:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8168
```

## Running the Admin Portal

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

Open:
- Admin UI: `http://localhost:3000`

## API Contract

Expected backend endpoints:
- `/api/admin/dashboard/summary`
- `/api/admin/attendance/records`
- `/api/admin/attendance/dates`
- `/api/admin/persons/list`
- `/api/admin/persons/stats`

## Fullstack Local Workflow

Run both projects in separate terminals.

1. Backend terminal:

```bash
cd ../attendance-face-detection
uvicorn main:app --reload --host 0.0.0.0 --port 8168
```

2. Admin terminal:

```bash
npm run dev
```

Open:
- Admin UI: `http://localhost:3000`
- Backend docs: `http://127.0.0.1:8168/docs`

## Project Structure

- `app/(admin)/dashboard` dashboard view
- `app/(admin)/attendance` attendance records view
- `app/(admin)/persons` persons view
- `components/admin` reusable layout components
- `lib/api.ts` API client
- `lib/types.ts` shared response types

## Troubleshooting

- API request failures:
	- Verify backend is running.
	- Verify `NEXT_PUBLIC_API_BASE_URL`.
- CORS issues:
	- Set backend `ADMIN_ORIGIN=http://localhost:3000`.
- Empty visual data:
	- Ensure backend has logs and trained model artifacts.
