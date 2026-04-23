import type {
  ApiEnvelope,
  AttendanceRecord,
  DashboardSummary,
  PersonInfo,
  PersonStats,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8168";

async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
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
