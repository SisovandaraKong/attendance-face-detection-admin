import Link from "next/link";

import { Topbar } from "@/components/admin/topbar";
import { getAttendanceDates, getReportSummary } from "@/lib/api";
import type { ReportSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

type ReportsPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const selectedDate = params.date;

  let dates: string[] = [];
  let summary: ReportSummary | null = null;
  let message: string | null = null;

  try {
    [dates, summary] = await Promise.all([
      getAttendanceDates(),
      getReportSummary(selectedDate),
    ]);
  } catch (error) {
    message = error instanceof Error ? error.message : "Unknown error";
  }

  if (!summary) {
    return (
      <div className="page-wrap">
        <Topbar title="Reports" subtitle="Operational analytics" />
        <div className="error-card">Failed to load report summary: {message}</div>
      </div>
    );
  }

  const branchEntries = Object.entries(summary.branch_breakdown);

  return (
    <div className="page-wrap">
      <Topbar
        title="Reports"
        subtitle="Daily analytics combining attendance records and recognition evidence"
      />

      <section className="panel">
        <div className="panel-head stack-mobile">
          <h3>Choose Date</h3>
          <div className="chip-wrap">
            {dates.map((date) => (
              <Link
                key={date}
                href={`/reports?date=${date}`}
                className={date === (selectedDate ?? dates[0]) ? "chip active" : "chip"}
              >
                {date}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>Total Employees</p>
          <h2>{summary.total_employees}</h2>
        </article>
        <article className="kpi-card">
          <p>Enrolled Employees</p>
          <h2>{summary.enrolled_employees}</h2>
        </article>
        <article className="kpi-card">
          <p>Attendance Records</p>
          <h2>{summary.attendance_records_today}</h2>
        </article>
        <article className="kpi-card">
          <p>Open Records</p>
          <h2>{summary.open_attendance_records}</h2>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>Recognition Quality</h3>
          </div>
          <div className="stat-stack">
            <div className="mini-stat">
              <span>Matched Today</span>
              <strong>{summary.matched_recognition_today}</strong>
            </div>
            <div className="mini-stat">
              <span>Unregistered Today</span>
              <strong>{summary.unregistered_recognition_today}</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Enrollment Coverage</h3>
          </div>
          <div className="coverage-meter">
            <div
              className="coverage-fill"
              style={{
                width: `${
                  summary.total_employees
                    ? Math.round((summary.enrolled_employees / summary.total_employees) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="empty-copy">
            {summary.total_employees
              ? `${Math.round((summary.enrolled_employees / summary.total_employees) * 100)}% of employees are enrolled`
              : "No employees registered yet."}
          </p>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Branch Breakdown</h3>
          </div>
          {branchEntries.length ? (
            <div className="record-list">
              {branchEntries.map(([branch, count]) => (
                <div key={branch} className="inline-stat-row">
                  <span>{branch}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-copy">No branch attendance records for this date.</p>
          )}
        </article>
      </section>
    </div>
  );
}
