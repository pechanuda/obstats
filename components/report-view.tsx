import { formatLossPercent } from "../lib/filters";
import type { RaceReport } from "../lib/oris";
import { PrintButton } from "./print-button";

export function ReportView({
  report,
  title = "Report",
  printHref,
}: {
  report: RaceReport;
  title?: string;
  printHref: string;
}) {
  return (
    <section className="panel report">
      <div className="screen-report">
        <div className="report-header">
          <div>
            <h2>{title}</h2>
            <p className="empty-state">
              <strong>{report.event.name}</strong>
              {" · "}
              {report.event.date}
              {report.event.place ? ` · ${report.event.place}` : ""}
              {report.event.discipline ? ` · ${report.event.discipline}` : ""}
            </p>
          </div>
          <PrintButton href={printHref} />
        </div>

        {report.groups.length === 0 ? (
          <p className="empty-state">
            Pro vybraný klub nebyly v tomto závodě nalezeny žádné řádky, nebo API
            nevrátilo dostatek časových dat.
          </p>
        ) : (
          <div className="category-list">
            {report.groups.map((group) => (
              <article className="category-card" key={group.classId}>
                <header className="category-header category-header--compact">
                  <p className="category-meta">
                    <strong>{group.className}</strong>
                    {" · "}
                    Vítěz <strong>{group.winnerName}</strong>
                    {group.winnerClub ? ` (${group.winnerClub})` : ""}
                    {" · "}
                    <strong>{group.winnerTime ?? "N/A"}</strong>
                    {" · "}
                    {group.controls ?? "N/A"} kontrol
                    {" · "}
                    {group.distanceKm ? `${group.distanceKm} km` : "N/A"}
                    {" · "}
                    Převýšení {group.climbing ? `${group.climbing} m` : "N/A"}
                  </p>
                </header>

                <div className="table-wrap">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Závodník klubu</th>
                        <th>Poř.</th>
                        <th>Čas</th>
                        <th>Ztráta</th>
                        <th>Ztráta %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows.map((row) => (
                        <tr
                          key={`${group.classId}-${row.runnerName}-${row.place}-${row.runnerTime ?? "na"}`}
                        >
                          <td>
                            {row.runnerName}
                            {row.runnerClub ? ` (${row.runnerClub})` : ""}
                          </td>
                          <td>{row.place || <span className="muted">N/A</span>}</td>
                          <td>{row.runnerTime ?? <span className="muted">N/A</span>}</td>
                          <td>{row.lossTime ?? <span className="muted">N/A</span>}</td>
                          <td>
                            <span className="pill">{formatLossPercent(row.lossPercent)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
