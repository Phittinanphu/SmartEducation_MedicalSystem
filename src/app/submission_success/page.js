"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar2";
import SubmitSucessScreen from "../components/submit/SubmitSuccess";

function App() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");
  const studentAnswer = searchParams.get("studentAnswer");
  const correctAnswer = searchParams.get("correctAnswer");
  const score = searchParams.get("score");
  const evaluationMetricScores = searchParams.get("evaluationMetricScores");

  return (
    <div>
      <Navbar />
      <SubmitSucessScreen
        caseId={caseId}
        studentAnswer={studentAnswer}
        correctAnswer={correctAnswer}
        score={score}
        evaluationMetricScores={evaluationMetricScores}
      />
    </div>
  );
}

export default App;
