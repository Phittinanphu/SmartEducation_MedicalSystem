"use client";
import { useSearchParams } from "next/navigation";
import Report from "../components/report";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const patientName = searchParams.get("patient") || "Unknown Patient"; // รับค่าจาก URL เช่น ?patient=James%20Carter

  return <Report patientName={patientName} />;
}
