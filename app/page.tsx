import { FilterForm } from "../components/filter-form";
import { RaceTable } from "../components/race-table";
import { firstValue, monthOptions } from "../lib/filters";
import { getCurrentFilters, getEventOptions } from "../lib/oris";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function buildRaceHref(eventId: string, selectedYear: number, selectedMonth: number) {
  const params = new URLSearchParams({
    year: String(selectedYear),
    month: String(selectedMonth),
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

  const events = await getEventOptions(selectedYear, selectedMonth);
  const yearOptions = Array.from({ length: 4 }, (_, index) => current.year - 1 + index);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="page">
      <section className="panel intro-panel">
        <section className="hero hero-card">
          <h1>KOBUL - výsledkový výcuc z ORISu</h1>
          <p>
            Procházej orientační závody s výsledky pro KOBUL. Kliknutí na závod otevře samostatnou
            stránku reportu se seskupenými výsledky kategorií a možností tisku do PDF.
          </p>
        </section>

        <FilterForm
          action="/"
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          years={yearOptions}
          submitLabel="Filtrovat závody"
        />

        <section className="summary summary-inline">
          <h2>Aktuální filtry</h2>
          <p>
            Klub: <strong>KOBUL</strong>
            {" · "}
            Rok: <strong>{selectedYear}</strong>
            {" · "}
            Měsíc:{" "}
            <strong>{monthOptions.find((item) => item.value === selectedMonth)?.label}</strong>
            {" · "}
            Sport: <strong>OB</strong>
            {" · "}
            Typ závodu: <strong>Všechny závody</strong>
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
          <RaceTable
            rows={events.map((event) => ({
              id: event.id,
              date: event.date,
              name: event.name,
              organizer: event.organizer,
              href: buildRaceHref(event.id, selectedYear, selectedMonth),
              isToday: event.date === today,
            }))}
          />
        )}
      </section>
    </main>
  );
}
