import { formatLossPercent } from "../lib/filters";
import type { RaceReport } from "../lib/oris";

export function PrintReportPage({
  report,
  title,
}: {
  report: RaceReport;
  title: string;
}) {
  return (
    <main className="print-page">
      <header className="print-page-header">
        <h1>{title}</h1>
        <p>
          <strong>{report.event.name}</strong>
          {" · "}
          {report.event.date}
          {report.event.place ? ` · ${report.event.place}` : ""}
          {report.event.discipline ? ` · ${report.event.discipline}` : ""}
        </p>
      </header>

      {report.groups.map((group) => (
        <section className="print-group" key={`print-${group.classId}`}>
          <p className="print-group-title">
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
          <table className="print-table">
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
                  key={`print-${group.classId}-${row.runnerName}-${row.place}-${row.runnerTime ?? "na"}`}
                >
                  <td>
                    {row.runnerName}
                    {row.runnerClub ? ` (${row.runnerClub})` : ""}
                  </td>
                  <td>{row.place || "N/A"}</td>
                  <td>{row.runnerTime ?? "N/A"}</td>
                  <td>{row.lossTime ?? "N/A"}</td>
                  <td>{formatLossPercent(row.lossPercent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
