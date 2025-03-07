"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2";
import ScoreEvaluation from "../components/evaluation/ScoreEvaluation";
import ConversationAnalysis from "../components/evaluation/ConversationAnalysis";

export default function Page() {
  // State to hold JSON input read from the file.
  const [llmOutput, setLlmOutput] = useState(null);
  const [showConversationAnalysis, setShowConversationAnalysis] =
    useState(false);

  // On component mount, fetch the JSON file from the public folder.
  useEffect(() => {
    fetch("/evaluation.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("JSON file fetched successfully:", data);
        setLlmOutput(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON file:", error);
        console.log("Using default values.");
        setLlmOutput({
          case: "Unknown Case",
          evaluationMetricScores: {},
          conversationData: [], // Add default conversation data
        });
      });
  }, []);

  // Display a loading state until the JSON file is fetched.
  if (!llmOutput) {
    return <div>Loading...</div>;
  }

  return (
    // Full-width container with light blue background covering the entire page.
    <div className="bg-blue-100 min-h-screen">
      <Navbar />
      {/* Add space between Navbar and ConversationAnalysis */}
      <div className="mt-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {showConversationAnalysis ? (
          <ConversationAnalysis
            data={llmOutput.conversationData}
            onShowEvaluationMetrics={() => setShowConversationAnalysis(false)}
          />
        ) : (
          <ScoreEvaluation
            inputData={llmOutput}
            onShowConversationAnalysis={() => setShowConversationAnalysis(true)}
          />
        )}
      </div>
    </div>
  );
}
