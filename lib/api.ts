import { cookies } from "next/headers";

import type {
  ApiEnvelope,
  AttendanceRecord,
  BranchInfo,
  DashboardSummary,
  PersonInfo,
  PersonStats,
  RecognitionEvent,
  RecognitionEventStats,
  ReportSummary,
  ShiftInfo,
  SystemHealth,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8168";

async function fetchFromApi<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!payload.success) {
    throw new Error(payload.message || "API request failed");
  }

  return payload.data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchFromApi<DashboardSummary>("/api/admin/dashboard/summary");
}

export async function getAttendanceRecords(
  date?: string,
): Promise<AttendanceRecord[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return fetchFromApi<AttendanceRecord[]>(`/api/admin/attendance/records${query}`);
}

export async function getAttendanceDates(): Promise<string[]> {
  return fetchFromApi<string[]>("/api/admin/attendance/dates");
}

export async function getPersons(): Promise<PersonInfo[]> {
  return fetchFromApi<PersonInfo[]>("/api/admin/persons/list");
}

export async function getPersonStats(): Promise<PersonStats> {
  return fetchFromApi<PersonStats>("/api/admin/persons/stats");
}

export async function getRecognitionEvents(
  date?: string,
  matchResult?: string,
): Promise<RecognitionEvent[]> {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (matchResult) params.set("match_result", matchResult);
  const query = params.size ? `?${params.toString()}` : "";
  return fetchFromApi<RecognitionEvent[]>(`/api/admin/recognition-events${query}`);
}

export async function getRecognitionEventStats(
  date?: string,
): Promise<RecognitionEventStats> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return fetchFromApi<RecognitionEventStats>(`/api/admin/recognition-events/stats${query}`);
}

export async function getReportSummary(date?: string): Promise<ReportSummary> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return fetchFromApi<ReportSummary>(`/api/admin/reports/summary${query}`);
}

export async function getBranches(): Promise<BranchInfo[]> {
  return fetchFromApi<BranchInfo[]>("/api/admin/master-data/branches");
}

export async function getShifts(): Promise<ShiftInfo[]> {
  return fetchFromApi<ShiftInfo[]>("/api/admin/master-data/shifts");
}

export async function getSystemHealth(): Promise<SystemHealth> {
  return fetchFromApi<SystemHealth>("/api/admin/system/health");
}
