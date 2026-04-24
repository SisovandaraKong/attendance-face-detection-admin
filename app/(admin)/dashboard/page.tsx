import { EmptyState } from "@/components/admin/empty-state";
import { Topbar } from "@/components/admin/topbar";
import { TrendBars } from "@/components/admin/trend-bars";
import { getDashboardSummary, getPersons } from "@/lib/api";
import type { DashboardSummary, PersonInfo } from "@/lib/types";

export const dynamic = "force-dynamic";

function toTrendEntries(values: Record<string, number>) {
  return Object.entries(values)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      label: date.slice(5),
      value,
    }));
}

export default async function DashboardPage() {
  let summary: DashboardSummary | null = null;
  let persons: PersonInfo[] = [];
  let message: string | null = null;

  try {
    [summary, persons] = await Promise.all([getDashboardSummary(), getPersons()]);
  } catch (error) {
    message = error instanceof Error ? error.message : "Unknown error";
  }

  if (!summary) {
    return (
      <div className="page-wrap">
        <Topbar title="Dashboard" subtitle="Operational monitoring" />
        <div className="error-card">Failed to load dashboard data: {message}</div>
      </div>
    );
  }

  const streamUrl =
    (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8168") + "/stream";
  const dailyAttendanceTrend = toTrendEntries(summary.weekly_data);
  const weeklyLateTrend = toTrendEntries(summary.late_trend);
  const failedRecognitions =
    summary.recognition_stats.rejected_events +
    summary.recognition_stats.duplicate_ignored_events;
  const recognitionComparison = [
    { label: "Success", value: summary.recognition_stats.matched_events },
    { label: "Failure", value: failedRecognitions },
  ];
  const enrollmentWarnings = persons.filter(
    (person) =>
      !person.complete ||
      person.enrollment_status !== "ENROLLED" ||
      !person.is_active,
  );

  return (
    <div className="page-wrap">
      <Topbar
        title="Dashboard"
        subtitle="Decision-oriented monitoring for attendance operations and AI quality"
      />

      <section className="kpi-grid kpi-grid-five">
        <article className="kpi-card">
          <p>Present Today</p>
          <h2>{summary.report_summary.present_records}</h2>
        </article>
        <article className="kpi-card">
          <p>Late Today</p>
          <h2>{summary.report_summary.late_records}</h2>
        </article>
        <article className="kpi-card">
          <p>Failed Recognitions</p>
          <h2>{failedRecognitions}</h2>
        </article>
        <article className="kpi-card">
          <p>Total Enrolled Staff</p>
          <h2>{summary.report_summary.enrolled_employees}</h2>
        </article>
        <article className="kpi-card">
          <p>Model Readiness</p>
          <h2>{summary.model_ready ? "Ready" : "Not Ready"}</h2>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>Live Recognition Feed</h3>
          </div>
          <div className="stream-frame-wrap">
            {summary.model_ready ? (
              <img
                src={streamUrl}
                alt="Live recognition stream"
                className="stream-frame"
              />
            ) : (
              <EmptyState
                title="Model unavailable"
                description="Train and reload the FastAPI backend before live monitoring can begin."
              />
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Recognition Quality Signals</h3>
          </div>
          <div className="stat-stack">
            <div className="mini-stat">
              <span>Matched Events</span>
              <strong>{summary.recognition_stats.matched_events}</strong>
            </div>
            <div className="mini-stat">
              <span>Review Required</span>
              <strong>{summary.recognition_stats.review_required_events}</strong>
            </div>
            <div className="mini-stat">
              <span>Outside Shift</span>
              <strong>{summary.report_summary.outside_shift_events}</strong>
            </div>
            <div className="mini-stat">
              <span>Unrecognized</span>
              <strong>{summary.report_summary.unrecognized_events}</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Enrollment Warnings</h3>
          </div>
          {enrollmentWarnings.length ? (
            <div className="record-list">
              {enrollmentWarnings.slice(0, 5).map((person) => (
                <div key={person.id} className="inline-stat-row">
                  <span>{person.full_name}</span>
                  <strong>{person.complete ? person.enrollment_status : "DATASET_INCOMPLETE"}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Enrollment healthy"
              description="All visible staff have sufficient dataset completeness and enrollment readiness."
            />
          )}
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>Daily Attendance Trend</h3>
          </div>
          <TrendBars
            data={dailyAttendanceTrend}
            tone="teal"
            emptyText="No attendance trend data available yet."
          />
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Weekly Late Trend</h3>
          </div>
          <TrendBars
            data={weeklyLateTrend}
            tone="amber"
            emptyText="No late attendance has been recorded in the current window."
          />
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Recognition Success vs Failure</h3>
          </div>
          <TrendBars
            data={recognitionComparison}
            tone="slate"
            emptyText="Recognition comparison is not available yet."
          />
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>Latest Recognitions</h3>
          </div>
          {summary.today_records.length ? (
            <ul className="record-list">
              {summary.today_records
                .slice()
                .reverse()
                .map((record, index) => (
                  <li key={`${record.name}-${record.time}-${index}`}>
                    <span>{record.name}</span>
                    <small>{record.status} · {record.time}</small>
                  </li>
                ))}
            </ul>
          ) : (
            <EmptyState
              title="No recognitions yet"
              description="The system has not recorded any attendance-related recognitions today."
            />
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Branch Breakdown</h3>
          </div>
          {Object.keys(summary.report_summary.branch_breakdown).length ? (
            <div className="record-list">
              {Object.entries(summary.report_summary.branch_breakdown).map(([branch, count]) => (
                <div key={branch} className="inline-stat-row">
                  <span>{branch}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No branch data"
              description="Branch attendance distribution will appear once attendance records exist."
            />
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Operational Readiness</h3>
          </div>
          <div className="record-list">
            <div className="inline-stat-row">
              <span>Open Attendance</span>
              <strong>{summary.report_summary.open_attendance_records}</strong>
            </div>
            <div className="inline-stat-row">
              <span>Review Required</span>
              <strong>{summary.report_summary.review_required_records}</strong>
            </div>
            <div className="inline-stat-row">
              <span>Tracked Days</span>
              <strong>{summary.days_logged}</strong>
            </div>
            <div className="inline-stat-row">
              <span>Known Persons</span>
              <strong>{summary.known_persons_count}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
