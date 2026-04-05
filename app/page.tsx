import Link from "next/link";
import { FilterForm } from "../components/filter-form";
import { firstValue, monthOptions } from "../lib/filters";
import {
  getClubOptions,
  getCurrentFilters,
  getEventOptions,
  getLevelOptions,
  getSportOptions,
} from "../lib/oris";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function buildRaceHref(
  eventId: string,
  selectedYear: number,
  selectedMonth: number,
  selectedClub: string,
  selectedSport: string,
  selectedLevel: string,
) {
  const params = new URLSearchParams({
    year: String(selectedYear),
    month: String(selectedMonth),
    club: selectedClub,
    sport: selectedSport,
    level: selectedLevel,
  });

  return `/report/${eventId}?${params.toString()}`;
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const current = getCurrentFilters();

  const selectedYear = Number(firstValue(params.year) ?? current.year);
  const selectedMonth = Number(firstValue(params.month) ?? current.month);
  const selectedClub = firstValue(params.club) ?? "73";
  const selectedSport = firstValue(params.sport) ?? "1";
  const selectedLevel = firstValue(params.level) ?? "all";

  const [clubs, sports, levels, events] = await Promise.all([
    getClubOptions(),
    getSportOptions(),
    getLevelOptions(),
    getEventOptions(selectedYear, selectedMonth, selectedSport, selectedLevel, selectedClub),
  ]);

  const selectedClubOption = clubs.find((club) => club.id === selectedClub);
  const selectedSportOption = sports.find((sport) => sport.id === selectedSport);
  const yearOptions = Array.from({ length: 4 }, (_, index) => current.year - 1 + index);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="page">
      <section className="panel intro-panel">
        <section className="hero hero-card">
          <h1>ORIS Report závodu</h1>
          <p>
            Procházej závody podle vybraného klubu a filtrů. Kliknutí na závod otevře
            samostatnou stránku reportu se seskupenými výsledky kategorií a možností tisku do PDF.
          </p>
        </section>

        <FilterForm
          action="/"
          clubs={clubs}
          sports={sports}
          levels={levels}
          selectedClub={selectedClub}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedSport={selectedSport}
          selectedLevel={selectedLevel}
          years={yearOptions}
          submitLabel="Načíst závody"
        />

        <section className="summary summary-inline">
          <h2>Aktuální filtry</h2>
          <p>
            Klub: <strong>{selectedClubOption?.abbr ?? selectedClub}</strong>
            {" · "}
            Rok: <strong>{selectedYear}</strong>
            {" · "}
            Měsíc:{" "}
            <strong>{monthOptions.find((item) => item.value === selectedMonth)?.label}</strong>
            {" · "}
            Sport: <strong>{selectedSportOption?.label ?? selectedSport}</strong>
            {" · "}
            Typ závodu: <strong>{selectedLevel === "all" ? "Všechny závody" : selectedLevel}</strong>
            {" · "}
            Nalezeno závodů: <strong>{events.length}</strong>
          </p>
          <p className="today-note">
            Dnes: <strong>{today}</strong>
          </p>
        </section>
      </section>

      <section className="panel report">
        <h2>Seznam závodů</h2>
        {events.length === 0 ? (
          <p className="empty-state">ORIS pro vybraný měsíc nevrátil žádné závody.</p>
        ) : (
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
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className={event.date === today ? "table-row--today" : undefined}
                  >
                    <td className="table-date">{event.date}</td>
                    <td>
                      <Link
                        className="table-link"
                        href={buildRaceHref(
                          event.id,
                          selectedYear,
                          selectedMonth,
                          selectedClub,
                          selectedSport,
                          selectedLevel,
                        )}
                      >
                        {event.name}
                      </Link>
                    </td>
                    <td>{event.organizer || "N/A"}</td>
                    <td>{event.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
