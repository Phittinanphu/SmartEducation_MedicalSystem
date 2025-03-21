"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar2";
import ScoreEvaluation from "../components/evaluation/ScoreEvaluation";
import ConversationAnalysis from "../components/evaluation/ConversationAnalysis";
import PatientInfo from "../components/case/Patientinfo"; // Add this import

export default function Page() {
  // State to hold JSON input read from the file.
  const [llmOutput, setLlmOutput] = useState(null);
  const [showConversationAnalysis, setShowConversationAnalysis] =
    useState(false);
  const searchParams = useSearchParams();

  // On component mount, fetch the data from the FastAPI endpoint.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const caseId = searchParams.get("caseId");
        const studentAnswer = searchParams.get("studentAnswer");
        const correctAnswer = searchParams.get("correctAnswer");
        const score = searchParams.get("score");
        const evaluationMetricScores = searchParams.get(
          "evaluationMetricScores"
        );

        const data = {
          case: caseId,
          studentAnswer: studentAnswer,
          correctAnswer: correctAnswer,
          score: score,
          evaluationMetricScores: JSON.parse(evaluationMetricScores),
          conversationData: [], // Add default conversation data
        };

        console.log("Data fetched successfully:", data);
        setLlmOutput(data);

        if (searchParams.get("view") === "conversation") {
          setShowConversationAnalysis(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Using default values.");
        setLlmOutput({
          case: "Unknown Case",
          evaluationMetricScores: {},
          conversationData: [], // Add default conversation data
        });
      }
    };

    fetchData();
  }, [searchParams]);

  // Display a loading state until the data is fetched.
  if (!llmOutput) {
    return <div>Loading...</div>;
  }

  return (
    // Full-width container with light blue background covering the entire page.
    <div className="bg-blue-100 min-h-screen">
      <Navbar />
      {/* Add space between Navbar and ConversationAnalysis */}
      <div className="mt-4" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="flex w-full">
          <div className="w-1/3 p-4">
            <PatientInfo /> {/* Render PatientInfo component */}
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
