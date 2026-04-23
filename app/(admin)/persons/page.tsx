import { Topbar } from "@/components/admin/topbar";
import { getPersonStats, getPersons } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PersonsPage() {
  try {
    const [stats, persons] = await Promise.all([getPersonStats(), getPersons()]);

    return (
      <div className="page-wrap">
        <Topbar
          title="Persons"
          subtitle="Dataset readiness and enrollment overview"
        />

        <section className="kpi-grid">
          <article className="kpi-card">
            <p>Total Persons</p>
            <h2>{stats.total_persons}</h2>
          </article>
          <article className="kpi-card">
            <p>Complete</p>
            <h2>{stats.complete}</h2>
          </article>
          <article className="kpi-card">
            <p>Incomplete</p>
            <h2>{stats.incomplete}</h2>
          </article>
          <article className="kpi-card">
            <p>Total Images</p>
            <h2>{stats.total_images}</h2>
          </article>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Enrollment Cards</h3>
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
                    key={person.name}
                    className={person.complete ? "person-card complete" : "person-card"}
                  >
                    <h4>{person.display_name}</h4>
                    <p>
                      {person.image_count} / {stats.total_needed_per_person} images
                    </p>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <small>{person.complete ? "Dataset complete" : "Needs more samples"}</small>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="empty-copy">No enrolled persons yet.</p>
          )}
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="page-wrap">
        <Topbar title="Persons" subtitle="Admin data" />
        <div className="error-card">Failed to load person data: {message}</div>
      </div>
    );
  }
}
