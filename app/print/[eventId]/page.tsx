import type { Metadata } from "next";
import { AutoPrint } from "../../../components/auto-print";
import { PrintReportPage } from "../../../components/print-report-page";
import { FIXED_CLUB_ID, getRaceReport } from "../../../lib/oris";

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
}: {
  params: Promise<{ eventId: string }>;
}) {
  const routeParams = await params;
  const report = await getRaceReport(routeParams.eventId, FIXED_CLUB_ID);

  return (
    <>
      <AutoPrint />
      <PrintReportPage report={report} title="KOBUL - výsledkový výcuc z ORISu" />
    </>
  );
}
