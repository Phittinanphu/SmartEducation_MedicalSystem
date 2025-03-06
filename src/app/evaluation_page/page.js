"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar2";
import ScoreEvaluation from '../components/evaluation/ScoreEvaluation';

export default function Page() {
  // State to hold JSON input read from the file.
  const [llmOutput, setLlmOutput] = useState(null);

  // On component mount, fetch the JSON file from the public folder.
  useEffect(() => {
    fetch('/evaluation.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        console.log('JSON file fetched successfully:', data);
        setLlmOutput(data);
      })
      .catch((error) => {
        console.error('Error fetching JSON file:', error);
        console.log('Using default values.');
        setLlmOutput({
          case: 'Unknown Case',
          evaluationMetricScores: {}
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
      {/* Centered container for the ScoreEvaluation content */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <ScoreEvaluation inputData={llmOutput} />
      </div>
    </div>
  );
}
