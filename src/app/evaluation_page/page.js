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

      // ChatHistory flow only needs caseId and studentAnswer
      if (caseId && studentAnswer) {
        // If we already have evaluation scores, use them directly
        if (correctAnswer && score && evaluationMetricScores) {
          try {
            // Try to parse the evaluationMetricScores if it's a string
            let parsedScores;
            try {
              console.log(
                "Raw evaluationMetricScores in evaluation_page:",
                evaluationMetricScores
              );

              // Handle both string format and empty string/null cases
              if (evaluationMetricScores && evaluationMetricScores !== "{}") {
                parsedScores = JSON.parse(evaluationMetricScores);
                console.log(
                  "Successfully parsed scores from URL:",
                  parsedScores
                );
              } else {
                console.log(
                  "Empty evaluationMetricScores, using default empty object"
                );
                parsedScores = {
                  domain1: {},
                  domain2: {},
                  domain3: {},
                  domain4: {},
                };
              }
            } catch (error) {
              console.error(
                "Error parsing evaluationMetricScores from URL:",
                error
              );
              console.log(
                "Raw evaluationMetricScores:",
                evaluationMetricScores
              );
              parsedScores = {
                domain1: {},
                domain2: {},
                domain3: {},
                domain4: {},
              };
            }

            const data = {
              case: correctAnswer,
              studentAnswer: studentAnswer,
              correctAnswer: correctAnswer,
              score: score,
              evaluationMetricScores: parsedScores,
              conversationData: JSON.parse(
                searchParams.get("conversationData") || "[]"
              ),
            };

            console.log("Direct evaluation data:", data);
            setLlmOutput(data);

            if (searchParams.get("view") === "conversation") {
              setShowConversationAnalysis(true);
            }
            return;
          } catch (error) {
            console.error("Error processing direct evaluation data:", error);
          }
        }

        // Otherwise fetch from API
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

          // Extract evaluationMetricScores from different possible locations in the response
          let evaluationScores = null;

          if (completionData && completionData.evaluationMetricScores) {
            evaluationScores = completionData.evaluationMetricScores;
          } else if (
            completionData &&
            completionData.result &&
            completionData.result.evaluationMetricScores
          ) {
            evaluationScores = completionData.result.evaluationMetricScores;
          }

          // If we still don't have scores, create a default structure
          if (!evaluationScores) {
            evaluationScores = {
              domain1: {},
              domain2: {},
              domain3: {},
              domain4: {},
            };
          }

          // Extract conversation data from different possible locations in the response
          let conversationData = [];

          if (completionData && completionData.conversationData) {
            // Direct conversationData property
            conversationData = completionData.conversationData;
            console.log("Found conversationData directly in response");
          } else if (
            completionData &&
            completionData.result &&
            completionData.result.conversationData
          ) {
            // Nested under result object
            conversationData = completionData.result.conversationData;
            console.log("Found conversationData in result object");
          } else if (completionData && Array.isArray(completionData.history)) {
            // Support for history array format (potential future format)
            console.log("Found history array in response");
            conversationData = completionData.history.map((item) => ({
              question: item.userMessage || item.question || "",
              comment: item.aiMessage || item.comment || "",
            }));
          }

          // Ensure conversationData is always an array with proper structure
          if (
            !Array.isArray(conversationData) ||
            conversationData.length === 0
          ) {
            console.log("No valid conversation data found, using placeholder");
            conversationData = [
              {
                question: "This function is currently unavailable.",
                comment: "This function is currently unavailable.",
              },
            ];
          }

          // Ensure each item has the expected structure
          conversationData = conversationData.map((item) => ({
            question: item.question || "No question available",
            comment: item.comment || "No comment available",
          }));

          // Log extracted conversation data for debugging
          console.log("Processed conversation data:", conversationData);

          // Create the data object with the extracted scores and conversation data
          const data = {
            case: completionData.disease || "",
            studentAnswer: studentAnswer,
            correctAnswer: completionData.disease || "",
            score: completionData.score?.toString() || "0",
            evaluationMetricScores: evaluationScores,
            conversationData: conversationData,
          };

          console.log("Evaluation data:", data);
          setLlmOutput(data);
        } catch (error) {
          console.error("Error in ChatHistory flow completing request:", error);
        }
      } else {
        console.log(
          "Incomplete required parameters. Waiting for complete data."
        );
        return;
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
