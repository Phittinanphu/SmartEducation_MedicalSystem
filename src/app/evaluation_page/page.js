"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar2";
import ScoreEvaluation from "../components/evaluation/ScoreEvaluation";
import ConversationAnalysis from "../components/evaluation/ConversationAnalysis";
import PatientInfo from "../components/case/PatientinfoEVA";
import Cookies from "js-cookie";
import { Suspense } from "react";

function EvaluationContent() {
  const [llmOutput, setLlmOutput] = useState(null);
  const [showConversationAnalysis, setShowConversationAnalysis] =
    useState(false);
  const [patientData, setPatientData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = Cookies.get("user_id");
  const BE_DNS = process.env.NEXT_PUBLIC_BE_DNS;

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${BE_DNS}/chat/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: userId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
          return;
        }

        const data = await response.json();
        console.log("Patient data fetched:", data);
        setPatientData(data.patient_data);

        // Update URL with patient data using 'caseId' as key
        const queryParams = new URLSearchParams({
          caseId: data.case_id,
          Age: data.patient_data.Age,
          Name: data.patient_data.Name,
          Occupation: data.patient_data.Occupation,
          Reason: data.patient_data.Reason,
          Sex: data.patient_data.Sex,
          Symptoms: data.patient_data.Symptoms,
        }).toString();

        router.push(`/evaluation_page?${queryParams}`);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [userId, BE_DNS, router]);

  // On component mount, fetch the evaluation data from the URL parameters
  useEffect(() => {
    const fetchData = async () => {
      const caseId = searchParams.get("caseId");
      const studentAnswer = searchParams.get("studentAnswer");
      const correctAnswer = searchParams.get("correctAnswer");
      const score = searchParams.get("score");
      const evaluationMetricScores = searchParams.get("evaluationMetricScores");

      console.log("Required search params:", {
        caseId,
        studentAnswer,
        correctAnswer,
        score,
        evaluationMetricScores,
      });

      // Validate required parameters:
      // For SubmitSuccess flow, require all five fields
      // For ChatHistory flow, only caseId and studentAnswer are needed
      let valid = false;
      if (caseId && studentAnswer) {
        if (correctAnswer || score || evaluationMetricScores) {
          // If any of the additional submit fields exist, then all must be provided
          if (correctAnswer && score && evaluationMetricScores) {
            valid = true;
          }
        } else {
          // ChatHistory flow
          valid = true;
        }
      }

      if (!valid) {
        console.log(
          "Incomplete required parameters. Waiting for complete data."
        );
        return;
      }

      // If SubmitSuccess flow (all parameters provided), use them directly
      if (correctAnswer && score && evaluationMetricScores) {
        const data = {
          case: caseId,
          studentAnswer: studentAnswer,
          correctAnswer: correctAnswer,
          score: score,
          evaluationMetricScores: JSON.parse(evaluationMetricScores),
          conversationData: [],
        };
        console.log("Evaluation data from SubmitSuccess flow:", data);
        setLlmOutput(data.evaluationMetricScores);
      } else {
        // ChatHistory flow: call /chat/complete endpoint to retrieve LlmOutput
        try {
          const completionResponse = await fetch(`${BE_DNS}/chat/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              case_id: caseId,
              answer: studentAnswer,
            }),
          });
          if (!completionResponse.ok) {
            const errorData = await completionResponse.json();
            console.error("Error in completion request:", errorData);
            return;
          }
          const completionData = await completionResponse.json();
          console.log("Completion response:", completionData);
          const data = {
            case: caseId,
            studentAnswer: studentAnswer,
            correctAnswer: completionData.disease || "",
            score: completionData.score || "",
            evaluationMetricScores: completionData.evaluationMetricScores || {},
            conversationData: [],
          };
          console.log("Evaluation data from ChatHistory flow:", data);
          setLlmOutput(data.evaluationMetricScores);
        } catch (error) {
          console.error("Error in ChatHistory flow completing request:", error);
        }
      }

      if (searchParams.get("view") === "conversation") {
        setShowConversationAnalysis(true);
      }
    };

    fetchData();
  }, [searchParams, BE_DNS]);

  // Show processing... if required data is missing
  if (!llmOutput || !patientData) {
    return <div>processing...</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen">
      <Navbar />
      <div className="mt-4" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="flex w-full">
          <div className="w-1/3 p-4">
            <PatientInfo patientData={patientData} />
          </div>
          <div className="flex-1">
            {showConversationAnalysis ? (
              <ConversationAnalysis
                data={llmOutput.conversationData}
                onShowEvaluationMetrics={() =>
                  setShowConversationAnalysis(false)
                }
              />
            ) : (
              <ScoreEvaluation
                inputData={llmOutput}
                onShowConversationAnalysis={() =>
                  setShowConversationAnalysis(true)
                }
              />
            )}
          </div>
        </div>
      </div>
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
      <EvaluationContent />
    </Suspense>
  );
}
