import Link from "next/link";
import type { Metadata } from "next";
import { FilterForm } from "../../../components/filter-form";
import { ReportView } from "../../../components/report-view";
import { firstValue } from "../../../lib/filters";
import { FIXED_CLUB_ID, getCurrentFilters, getRaceReport } from "../../../lib/oris";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const report = await getRaceReport(routeParams.eventId, "73");
  const organizer = report.event.organizer || "ORIS";

  return {
    title: `${organizer}-${report.event.date}.pdf`,
  };
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: SearchParams;
}) {
  const routeParams = await params;
  const query = await searchParams;
  const current = getCurrentFilters();

  const selectedYear = Number(firstValue(query.year) ?? current.year);
  const selectedMonth = Number(firstValue(query.month) ?? current.month);

  const report = await getRaceReport(routeParams.eventId, FIXED_CLUB_ID);

  const yearOptions = Array.from({ length: 4 }, (_, index) => current.year - 1 + index);
  const backParams = new URLSearchParams({
    year: String(selectedYear),
    month: String(selectedMonth),
  });
  const printParams = new URLSearchParams({
    year: String(selectedYear),
    month: String(selectedMonth),
  });

  return (
    <main className="page">
      <section className="panel intro-panel">
        <section className="hero hero-card">
          <h1>KOBUL - výsledkový výcuc z ORISu</h1>
          <p>Report vybraného závodu seskupený podle kategorií pro KOBUL.</p>
        </section>

        <FilterForm
          action={`/?${backParams.toString()}`}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          years={yearOptions}
          submitLabel="Zpět na filtrovaný seznam závodů"
        />
      </section>

      <ReportView
        report={report}
        title="Report závodu"
        printHref={`/print/${routeParams.eventId}?${printParams.toString()}`}
      />
    </main>
  );
}
