import Link from "next/link";

import { Topbar } from "@/components/admin/topbar";
import { getAttendanceDates, getAttendanceRecords } from "@/lib/api";

export const dynamic = "force-dynamic";

type AttendancePageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function AttendancePage({
  searchParams,
}: AttendancePageProps) {
  try {
    const params = await searchParams;
    const selectedDate = params.date;
    const [dates, records] = await Promise.all([
      getAttendanceDates(),
      getAttendanceRecords(selectedDate),
    ]);

    return (
      <div className="page-wrap">
        <Topbar
          title="Attendance"
          subtitle="Historical attendance records from CSV logs"
        />

        <section className="panel">
          <div className="panel-head stack-mobile">
            <h3>Filter by Date</h3>
            <div className="chip-wrap">
              {dates.map((date) => (
                <Link
                  key={date}
                  href={`/attendance?date=${date}`}
                  className={
                    date === (selectedDate ?? dates[0]) ? "chip active" : "chip"
                  }
                >
                  {date}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Records ({records.length})</h3>
          </div>

          {records.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={`${record.name}-${record.time}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{record.name}</td>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                      <td>
                        <span className="status-pill">{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-copy">No records for the selected date.</p>
          )}
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <div className="page-wrap">
        <Topbar title="Attendance" subtitle="Admin data" />
        <div className="error-card">Failed to load attendance data: {message}</div>
      </div>
    );
  }
}
