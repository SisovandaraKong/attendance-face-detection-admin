import { Topbar } from "@/components/admin/topbar";
import { getDashboardSummary } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const summary = await getDashboardSummary();
    const streamUrl =
      (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8168") +
      "/stream";
    const weeklyEntries = Object.entries(summary.weekly_data).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    return (
      <div className="page-wrap">
        <Topbar
          title="Dashboard"
          subtitle="Realtime monitoring from FastAPI recognition service"
        />

        <section className="kpi-grid">
          <article className="kpi-card">
            <p>Present Today</p>
            <h2>{summary.today_count}</h2>
          </article>
          <article className="kpi-card">
            <p>Known Persons</p>
            <h2>{summary.known_persons_count}</h2>
          </article>
          <article className="kpi-card">
            <p>Days Logged</p>
            <h2>{summary.days_logged}</h2>
          </article>
          <article className="kpi-card">
            <p>Model Status</p>
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
                <p className="empty-copy">
                  Model is not ready. Train and reload FastAPI backend first.
                </p>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h3>Weekly Attendance</h3>
            </div>
            {weeklyEntries.length ? (
              <div className="bars">
                {weeklyEntries.map(([date, count]) => (
                  <div key={date} className="bar-col">
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.max(count * 12, 8)}px` }}
                    />
                    <p>{date.slice(5)}</p>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-copy">No attendance logs available yet.</p>
            )}
          </article>

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
                      <small>{record.time}</small>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="empty-copy">No records today.</p>
            )}
          </article>
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="page-wrap">
        <Topbar title="Dashboard" subtitle="Admin data" />
        <div className="error-card">Failed to load dashboard data: {message}</div>
      </div>
    );
  }
}
