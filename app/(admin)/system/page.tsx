import { redirect } from "next/navigation";

import { Topbar } from "@/components/admin/topbar";
import { requireAdminSession } from "@/lib/auth";
import { getBranches, getShifts, getSystemHealth } from "@/lib/api";
import type { BranchInfo, ShiftInfo, SystemHealth } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const session = await requireAdminSession();
  if (session.role !== "super_admin") {
    redirect("/dashboard");
  }

  let health: SystemHealth | null = null;
  let branches: BranchInfo[] = [];
  let shifts: ShiftInfo[] = [];
  let message: string | null = null;

  try {
    [health, branches, shifts] = await Promise.all([
      getSystemHealth(),
      getBranches(),
      getShifts(),
    ]);
  } catch (error) {
    message = error instanceof Error ? error.message : "Unknown error";
  }

  if (!health) {
    return (
      <div className="page-wrap">
        <Topbar title="System" subtitle="Operational foundation" />
        <div className="error-card">Failed to load system data: {message}</div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <Topbar
        title="System"
        subtitle="Health, branch structure, and attendance rule baselines"
      />

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>App Status</p>
          <h2>{health.app_status}</h2>
        </article>
        <article className="kpi-card">
          <p>Database</p>
          <h2>{health.database_status}</h2>
        </article>
        <article className="kpi-card">
          <p>Today Events</p>
          <h2>{health.today_recognition_events}</h2>
        </article>
        <article className="kpi-card">
          <p>Today Attendance</p>
          <h2>{health.today_attendance_records}</h2>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>Model Readiness</h3>
          </div>
          <div className="stat-stack">
            <div className="mini-stat">
              <span>Model Ready</span>
              <strong>{health.model_ready ? "YES" : "NO"}</strong>
            </div>
            <div className="mini-stat">
              <span>Known Persons</span>
              <strong>{health.known_persons_count}</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Branches</h3>
          </div>
          {branches.length ? (
            <div className="record-list">
              {branches.map((branch) => (
                <div key={branch.id} className="inline-stat-row">
                  <span>{branch.code} · {branch.name}</span>
                  <strong>{branch.city ?? "-"}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-copy">No branches configured.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Shifts</h3>
          </div>
          {shifts.length ? (
            <div className="record-list">
              {shifts.map((shift) => (
                <div key={shift.id} className="inline-stat-row">
                  <span>{shift.code} · {shift.start_time} - {shift.end_time}</span>
                  <strong>{shift.grace_minutes}m</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-copy">No shifts configured.</p>
          )}
        </article>
      </section>
    </div>
  );
}
