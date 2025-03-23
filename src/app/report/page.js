"use client";
import { useSearchParams } from "next/navigation";
import Report from "../components/report";
import { Suspense } from "react";

function ReportContent() {
  const searchParams = useSearchParams();
  const patientName = searchParams.get("patient") || "Unknown Patient";
  return <Report patientName={patientName} />;
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
