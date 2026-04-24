import { EmptyState } from "@/components/admin/empty-state";
import { PersonCreateForm } from "@/components/admin/person-create-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { Topbar } from "@/components/admin/topbar";
import { getPersonStats, getPersons } from "@/lib/api";
import type { PersonInfo, PersonStats } from "@/lib/types";

export const dynamic = "force-dynamic";

function getEnrollmentTone(person: PersonInfo) {
  if (!person.is_active) return "danger";
  if (!person.complete || person.enrollment_status !== "ENROLLED") return "warning";
  return "success";
}

export default async function PersonsPage() {
  let stats: PersonStats | null = null;
  let persons: PersonInfo[] = [];
  let message: string | null = null;

  try {
    [stats, persons] = await Promise.all([getPersonStats(), getPersons()]);
  } catch (error) {
    message = error instanceof Error ? error.message : "Unknown error";
  }

  if (!stats) {
    return (
      <div className="page-wrap">
        <Topbar title="Persons" subtitle="Enrollment monitoring" />
        <div className="error-card">Failed to load person data: {message}</div>
      </div>
    );
  }

  const warningPersons = persons.filter(
    (person) =>
      !person.complete ||
      person.enrollment_status !== "ENROLLED" ||
      !person.is_active,
  );

  return (
    <div className="page-wrap">
      <Topbar
        title="Persons"
        subtitle="Enrollment quality, dataset completeness, and missing-enrollment warnings"
      />

      <section className="kpi-grid">
        <article className="kpi-card">
          <p>Total Persons</p>
          <h2>{stats.total_persons}</h2>
        </article>
        <article className="kpi-card">
          <p>Enrollment Complete</p>
          <h2>{stats.complete}</h2>
        </article>
        <article className="kpi-card">
          <p>Enrollment Warnings</p>
          <h2>{warningPersons.length}</h2>
        </article>
        <article className="kpi-card">
          <p>Total Images</p>
          <h2>{stats.total_images}</h2>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>Register Employee</h3>
          </div>
          <PersonCreateForm />
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Missing Enrollment Warnings</h3>
          </div>
          {warningPersons.length ? (
            <div className="record-list">
              {warningPersons.slice(0, 6).map((person) => (
                <div key={person.id} className="inline-stat-row">
                  <span>{person.full_name}</span>
                  <strong>{person.complete ? person.enrollment_status : "DATASET_INCOMPLETE"}</strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No warnings"
              description="All employees currently shown have acceptable enrollment readiness."
            />
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>Enrollment Health Summary</h3>
          </div>
          <div className="record-list">
            <div className="inline-stat-row">
              <span>Incomplete Profiles</span>
              <strong>{stats.incomplete}</strong>
            </div>
            <div className="inline-stat-row">
              <span>Target Images per Person</span>
              <strong>{stats.total_needed_per_person}</strong>
            </div>
            <div className="inline-stat-row">
              <span>Average Images per Person</span>
              <strong>{stats.total_persons ? Math.round(stats.total_images / stats.total_persons) : 0}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Employee Enrollment Cards</h3>
        </div>

        {persons.length ? (
          <div className="person-grid">
            {persons.map((person) => {
              const progress = Math.min(
                Math.round((person.image_count / stats.total_needed_per_person) * 100),
                100,
              );

              return (
                <article
                  key={person.id}
                  className={person.complete ? "person-card complete" : "person-card"}
                >
                  <div className="card-split">
                    <div>
                      <h4>{person.full_name}</h4>
                      <p>{person.employee_code}</p>
                    </div>
                    <StatusBadge
                      label={person.enrollment_status}
                      tone={getEnrollmentTone(person)}
                    />
                  </div>
                  <p>
                    {person.branch_name} / {person.department_name}
                  </p>
                  <p>
                    {person.image_count} / {stats.total_needed_per_person} images
                  </p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <small>
                    {progress}% complete · {person.complete ? "Dataset complete" : "More samples required"}
                  </small>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No registered persons"
            description="Register an employee first to begin enrollment and dataset preparation."
          />
        )}
      </section>
    </div>
  );
}
