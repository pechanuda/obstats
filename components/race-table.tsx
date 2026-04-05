"use client";

import { useRouter } from "next/navigation";

type RaceRow = {
  id: string;
  date: string;
  name: string;
  organizer: string;
  href: string;
  isToday: boolean;
};

export function RaceTable({ rows }: { rows: RaceRow[] }) {
  const router = useRouter();

  return (
    <div className="table-wrap">
      <table className="compact-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Závod</th>
            <th>Pořadatel</th>
            <th>ORIS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={[
                "clickable-row",
                row.isToday ? "table-row--today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => router.push(row.href)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(row.href);
                }
              }}
              tabIndex={0}
              role="link"
            >
              <td className="table-date">{row.date}</td>
              <td>
                <span className="table-link">{row.name}</span>
              </td>
              <td>{row.organizer || "N/A"}</td>
              <td>{row.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
