"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar2";
import ScoreEvaluation from "../components/evaluation/ScoreEvaluation";
import ConversationAnalysis from "../components/evaluation/ConversationAnalysis";
import PatientInfo from "../components/case/PatientinfoEVA";
import { Suspense } from "react";

function EvaluationContent() {
  const [llmOutput, setLlmOutput] = useState(null);
  const [showConversationAnalysis, setShowConversationAnalysis] =
    useState(false);
  const [patientData, setPatientData] = useState(null);
  const searchParams = useSearchParams();
  const BE_DNS = process.env.NEXT_PUBLIC_BE_DNS;

  // Extract patient data from URL parameters on component mount
  useEffect(() => {
    const extractPatientData = () => {
      try {
        // First try to get the patientData JSON from the URL
        const patientDataParam = searchParams.get("patientData");
        console.log("Raw patientData param:", patientDataParam);

        if (patientDataParam) {
          try {
            // Parse the JSON patient data
            const parsedPatientData = JSON.parse(patientDataParam);
            console.log("Parsed patient data from URL:", parsedPatientData);

            // If we have the data, use it
            if (
              parsedPatientData &&
              Object.keys(parsedPatientData).length > 0
            ) {
              setPatientData(parsedPatientData);
              return;
            } else {
              console.warn("Parsed patientData is empty object");
            }
          } catch (parseError) {
            console.error("Error parsing patientData JSON:", parseError);
            console.log("Invalid patientData JSON:", patientDataParam);
          }
        } else {
          console.warn("patientData param is missing from URL");
        }

        // Fallback: try to get individual patient fields from the URL
        const individualPatientData = {
          Age: searchParams.get("Age"),
          Name: searchParams.get("Name"),
          Occupation: searchParams.get("Occupation"),
          Reason: searchParams.get("Reason"),
          Sex: searchParams.get("Sex") || searchParams.get("Gender"),
          Symptoms: searchParams.get("Symptoms"),
        };

        console.log(
          "Individual patient fields from URL:",
          individualPatientData
        );

        // Check if we have at least some data
        const hasData = Object.values(individualPatientData).some(
          (value) => value
        );

        if (hasData) {
          console.log("Using individual patient fields from URL");
          setPatientData(individualPatientData);
          return;
        }

        console.log("No patient data found in URL parameters, using defaults");
        setPatientData({
          Age: "N/A",
          Name: "N/A",
          Occupation: "N/A",
          Reason: "N/A",
          Sex: "N/A",
          Symptoms: "N/A",
        });
      } catch (error) {
        console.error("Error extracting patient data from URL:", error);
        // Set default values if there's an error parsing
        setPatientData({
          Age: "N/A",
          Name: "N/A",
          Occupation: "N/A",
          Reason: "N/A",
          Sex: "N/A",
          Symptoms: "N/A",
        });
      }
    };

    extractPatientData();
  }, [searchParams]);

  // On component mount, fetch the evaluation data from the URL parameters
  useEffect(() => {
    const fetchData = async () => {
      const caseId = searchParams.get("caseId");
      const studentAnswer = searchParams.get("studentAnswer");
      const correctAnswer = searchParams.get("correctAnswer");
      const score = searchParams.get("score");
      const evaluationMetricScores = searchParams.get("evaluationMetricScores");
      const conversationDataParam = searchParams.get("conversationData");

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

            // Parse conversation data from URL
            let parsedConversationData = [];
            try {
              if (conversationDataParam) {
                parsedConversationData = JSON.parse(conversationDataParam);
                console.log(
                  "Parsed conversation data from URL:",
                  parsedConversationData
                );
              }
            } catch (error) {
              console.error("Error parsing conversation data from URL:", error);
              parsedConversationData = [
                {
                  question: "This function is currently unavailable.",
                  comment: "This function is currently unavailable.",
                },
              ];
            }

            const data = {
              case: correctAnswer,
              studentAnswer: studentAnswer,
              correctAnswer: correctAnswer,
              score: score,
              evaluationMetricScores: parsedScores,
              conversationData: parsedConversationData,
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
