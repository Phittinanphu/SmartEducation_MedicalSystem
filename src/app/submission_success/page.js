"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar2";
import SubmitSucessScreen from "../components/submit/SubmitSuccess";

function SubmissionContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const studentAnswer = searchParams.get("studentAnswer");
  const correctAnswer = searchParams.get("correctAnswer");
  const score = searchParams.get("score");
  const evaluationMetricScores = searchParams.get("evaluationMetricScores");
  const rawPatientData = searchParams.get("patientData");

  // Parse patient data from URL parameters
  let patientData = {};
  try {
    if (rawPatientData) {
      patientData = JSON.parse(rawPatientData);
      console.log("Parsed patient data in submission_success:", patientData);
    } else {
      console.warn("No patient data found in URL parameters");
    }
  } catch (error) {
    console.error("Error parsing patient data:", error);
  }

  // Log what we received for debugging
  console.log(
    "submission_success received evaluationMetricScores:",
    evaluationMetricScores
  );

  return (
    <div>
      <Navbar />
      <SubmitSucessScreen
        caseId={caseId}
        studentAnswer={studentAnswer}
        correctAnswer={correctAnswer}
        score={score}
        evaluationMetricScores={evaluationMetricScores}
        patientData={patientData}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      }
    >
      <SubmissionContent />
    </Suspense>
  );
}
