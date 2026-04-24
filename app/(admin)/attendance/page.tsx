import Link from "next/link";

import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { Topbar } from "@/components/admin/topbar";
import { getAttendanceDates, getAttendanceRecords } from "@/lib/api";
import type { AttendanceRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

type AttendancePageProps = {
  searchParams: Promise<{ date?: string; status?: string; state?: string }>;
};

function getStatusTone(status: string) {
  if (status === "CHECKED_OUT") return "success";
  if (status === "LATE") return "warning";
  if (status === "PRESENT") return "info";
  if (status.includes("MISSING")) return "danger";
  return "neutral";
}

function getStateTone(state: string) {
  if (state === "CLOSED") return "success";
  if (state === "OPEN") return "info";
  if (state === "REVIEW_REQUIRED") return "warning";
  return "neutral";
}

export default async function AttendancePage({
  searchParams,
}: AttendancePageProps) {
  const params = await searchParams;
  const selectedDate = params.date;
  const selectedStatus = params.status?.toUpperCase() ?? "ALL";
  const selectedState = params.state?.toUpperCase() ?? "ALL";

  let dates: string[] = [];
  let records: AttendanceRecord[] = [];
  let message: string | null = null;

  try {
    [dates, records] = await Promise.all([
      getAttendanceDates(),
      getAttendanceRecords(selectedDate),
    ]);
  } catch (error) {
    message = error instanceof Error ? error.message : "Unknown error";
  }

  if (message) {
    return (
      <div className="page-wrap">
        <Topbar title="Attendance" subtitle="Operational attendance records" />
        <div className="error-card">Failed to load attendance data: {message}</div>
      </div>
    );
  }

  const statusOptions = ["ALL", ...Array.from(new Set(records.map((record) => record.attendance_status)))];
  const stateOptions = ["ALL", ...Array.from(new Set(records.map((record) => record.record_state)))];
  const filteredRecords = records.filter((record) => {
    if (selectedStatus !== "ALL" && record.attendance_status !== selectedStatus) return false;
    if (selectedState !== "ALL" && record.record_state !== selectedState) return false;
    return true;
  });

  return (
    <div className="page-wrap">
      <Topbar
        title="Attendance"
        subtitle="Business attendance records with linked recognition outcomes"
      />

      <section className="panel">
        <div className="panel-head stack-mobile">
          <h3>Filter by Date</h3>
          <div className="chip-wrap">
            {dates.map((date) => (
              <Link
                key={date}
                href={`/attendance?date=${date}&status=${selectedStatus}&state=${selectedState}`}
                className={
                  date === (selectedDate ?? dates[0]) ? "chip active" : "chip"
                }
              >
                {date}
              </Link>
            ))}
          </div>
        </div>
        <div className="filter-row split-filters">
          <div className="chip-wrap">
            {statusOptions.map((status) => (
              <Link
                key={status}
                href={`/attendance?date=${selectedDate ?? dates[0] ?? ""}&status=${status}&state=${selectedState}`}
                className={status === selectedStatus ? "chip active" : "chip"}
              >
                {status.replaceAll("_", " ")}
              </Link>
            ))}
          </div>
          <div className="chip-wrap">
            {stateOptions.map((state) => (
              <Link
                key={state}
                href={`/attendance?date=${selectedDate ?? dates[0] ?? ""}&status=${selectedStatus}&state=${state}`}
                className={state === selectedState ? "chip active" : "chip"}
              >
                {state.replaceAll("_", " ")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Attendance Records ({filteredRecords.length})</h3>
        </div>

        {filteredRecords.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Branch / Department</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Recognition Details</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={`${record.employee_code}-${record.work_date}-${index}`}>
                    <td>
                      <strong>{record.employee_name}</strong>
                      <br />
                      <small>{record.employee_code}</small>
                    </td>
                    <td>
                      {record.branch}
                      <br />
                      <small>{record.department}</small>
                    </td>
                    <td>
                      <strong>{record.work_date}</strong>
                      <br />
                      <small>
                        In: {record.check_in_time ?? "-"} / Out: {record.check_out_time ?? "-"}
                      </small>
                    </td>
                    <td>
                      <div className="badge-stack">
                        <StatusBadge
                          label={record.attendance_status}
                          tone={getStatusTone(record.attendance_status)}
                        />
                        <StatusBadge
                          label={record.record_state}
                          tone={getStateTone(record.record_state)}
                        />
                      </div>
                      <small>{record.minutes_late} min late · {record.overtime_minutes} min overtime</small>
                    </td>
                    <td>
                      <strong>Check-in</strong>: {record.check_in_outcome ?? "-"}
                      <br />
                      <strong>Check-out</strong>: {record.check_out_outcome ?? "-"}
                    </td>
                    <td>
                      <strong>{record.source_type}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No attendance records"
            description="No records match the selected date and filter combination."
          />
        )}
      </section>
    </div>
  );
}
