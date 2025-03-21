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

  return (
    <div>
      <Navbar />
      <SubmitSucessScreen
        caseId={caseId}
        studentAnswer={studentAnswer}
        correctAnswer={correctAnswer}
      />
    </div>
  );
}

export default App;
