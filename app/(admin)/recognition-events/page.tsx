import Link from "next/link";

import { Topbar } from "@/components/admin/topbar";
import { getAttendanceDates, getRecognitionEventStats, getRecognitionEvents } from "@/lib/api";
import type { RecognitionEvent, RecognitionEventStats } from "@/lib/types";

export const dynamic = "force-dynamic";

type RecognitionEventsPageProps = {
  searchParams: Promise<{ date?: string; match_result?: string }>;
};

const filters = ["ALL", "MATCHED", "LOW_LIVENESS", "DUPLICATE_IGNORED", "OUTSIDE_SHIFT_WINDOW", "UNREGISTERED", "UNKNOWN"];

export default async function RecognitionEventsPage({
  searchParams,
}: RecognitionEventsPageProps) {
  const params = await searchParams;
  const selectedDate = params.date;
  const selectedFilter = params.match_result?.toUpperCase() ?? "ALL";

  let dates: string[] = [];
  let events: RecognitionEvent[] = [];
  let stats: RecognitionEventStats | null = null;
  let message: string | null = null;

  try {
    [dates, events, stats] = await Promise.all([
      getAttendanceDates(),
      getRecognitionEvents(selectedDate, selectedFilter === "ALL" ? undefined : selectedFilter),
      getRecognitionEventStats(selectedDate),
    ]);
  } catch (error) {
    message = error instanceof Error ? error.message : "Unknown error";
  }

  if (!stats) {
    return (
      <div className="page-wrap">
        <Topbar title="Recognition Events" subtitle="AI evidence review" />
        <div className="error-card">Failed to load recognition events: {message}</div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <Topbar
        title="Recognition Events"
        subtitle="Raw AI evidence separated from official attendance records"
      />

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>Total Events</p>
          <h2>{stats.total_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Matched</p>
          <h2>{stats.matched_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Unregistered</p>
          <h2>{stats.unregistered_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Review Required</p>
          <h2>{stats.review_required_events}</h2>
        </article>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>Duplicate Ignored</p>
          <h2>{stats.duplicate_ignored_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Outside Shift</p>
          <h2>{stats.outside_shift_window_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Rejected Events</p>
          <h2>{stats.rejected_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Unknown</p>
          <h2>{stats.unknown_events}</h2>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head stack-mobile">
          <h3>Filter</h3>
          <div className="chip-wrap">
            {dates.map((date) => (
              <Link
                key={date}
                href={`/recognition-events?date=${date}&match_result=${selectedFilter}`}
                className={date === (selectedDate ?? dates[0]) ? "chip active" : "chip"}
              >
                {date}
              </Link>
            ))}
          </div>
        </div>
        <div className="chip-wrap filter-row">
          {filters.map((filter) => (
            <Link
              key={filter}
              href={`/recognition-events?date=${selectedDate ?? dates[0] ?? ""}&match_result=${filter}`}
              className={filter === selectedFilter ? "chip active" : "chip"}
            >
              {filter}
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Recognition Evidence ({events.length})</h3>
        </div>

        {events.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Employee</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>AI Result</th>
                  <th>Business Outcome</th>
                  <th>Mode</th>
                  <th>Branch / Kiosk</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.occurred_at}</td>
                    <td>
                      <strong>{event.employee_name ?? "-"}</strong>
                      <br />
                      <small>{event.employee_code ?? "Unmapped"}</small>
                    </td>
                    <td>{event.predicted_label ?? "-"}</td>
                    <td>
                      {Math.round(event.confidence * 100)}%
                      <br />
                      <small>
                        Liveness: {event.liveness_score !== null ? `${Math.round(event.liveness_score * 100)}%` : "-"}
                      </small>
                    </td>
                    <td>
                      <span className="status-pill">{event.match_result}</span>
                    </td>
                    <td>
                      <strong>{event.business_outcome ?? "-"}</strong>
                      <br />
                      <small>{event.attendance_action ?? "-"}</small>
                      <br />
                      <small>
                        Duplicate: {event.duplicate_suppressed ? "Yes" : "No"}
                        {event.snapshot_reference ? ` • Snapshot: ${event.snapshot_reference}` : ""}
                      </small>
                    </td>
                    <td>{event.event_mode}</td>
                    <td>
                      {event.branch ?? "-"}
                      <br />
                      <small>{event.kiosk_device ?? "-"}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-copy">No recognition events for the selected filter.</p>
        )}
      </section>
    </div>
  );
}
