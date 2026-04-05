import type { Metadata } from "next";
import { AutoPrint } from "../../../components/auto-print";
import { PrintReportPage } from "../../../components/print-report-page";
import { getRaceReport } from "../../../lib/oris";
import { firstValue } from "../../../lib/filters";

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

export default async function PrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const routeParams = await params;
  const query = await searchParams;
  const clubId = firstValue(query.club) ?? "73";
  const report = await getRaceReport(routeParams.eventId, clubId);

  return (
    <>
      <AutoPrint />
      <PrintReportPage report={report} title="KOBUL - výsledkový výcuc z ORISu" />
    </>
  );
}
