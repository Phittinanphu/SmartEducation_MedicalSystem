"use client";

import React, { useState, useEffect } from 'react';
import ScoreEvaluation from '../components/evaluation/ScoreEvaluation';

export default function Page() {
  // State to hold JSON input read from the file
  const [llmOutput, setLlmOutput] = useState(null);

  // On mount, fetch the JSON file from the public folder
  useEffect(() => {
    fetch('/evaluation.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('JSON file fetched successfully:', data);
        setLlmOutput(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON file: ", error);
        console.log("JSON file could not be fetched, using default values.");
        // Set default values if fetching fails
        setLlmOutput({
          case: 'Unknown Case',
          domainScores: { domain1: 0, domain2: 0, domain3: 0, domain4: 0 },
          evaluationMetricScores: {},
        });
      });
  }, []);

  // Show a loading message until the JSON file is fetched
  if (!llmOutput) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Student Evaluation</h1>
      {/* Pass the fetched JSON data to the ScoreEvaluation component */}
      <ScoreEvaluation inputData={llmOutput} />
    </div>
  );
}
