"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ChatHistoryProps {
  examData: {
    patientName: string;
    age: string;
    symptoms: string;
    diagnosis: string;
    medications: string;
  } | null;
  chatHistory: Array<{ sender: string; text: string }>;
  onPrevious: () => void;
  caseId: string;
  patientData?: {
    Age?: string;
    Name?: string;
    Occupation?: string;
    Reason?: string;
    Sex?: string;
    Symptoms?: string;
  };
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  examData,
  chatHistory,
  onPrevious,
  caseId,
  patientData,
}) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const BE_IP = process.env.NEXT_PUBLIC_BE_DNS;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Log the patient data we're working with
      console.log("Patient data in ChatHistory before submit:", patientData);

      // Send the completion request
      const completionResponse = await fetch(`${BE_IP}/chat/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          case_id: caseId,
          answer: examData?.diagnosis || "",
        }),
      });

      if (!completionResponse.ok) {
        const errorData = await completionResponse.json();
        console.error("Error:", errorData);
        return;
      }

      const completionData = await completionResponse.json();
      console.log("Completion response:", completionData);

      // Extract evaluationMetricScores from the response structure
      // First, check if it exists in the response
      let evaluationData = null;

      if (completionData && completionData.evaluationMetricScores) {
        evaluationData = completionData.evaluationMetricScores;
      } else if (
        completionData &&
        completionData.result &&
        completionData.result.evaluationMetricScores
      ) {
        evaluationData = completionData.result.evaluationMetricScores;
      }

      // Log the actual extracted score data
      console.log("Raw evaluationMetricScores extracted:", evaluationData);

      // If it's still null, create a default empty structure
      if (!evaluationData) {
        evaluationData = {
          domain1: {},
          domain2: {},
          domain3: {},
          domain4: {},
        };
      }

      // Properly stringify the patient data
      let patientDataString = "{}";
      try {
        patientDataString = JSON.stringify(patientData || {});
        console.log("Stringified patient data:", patientDataString);
      } catch (error) {
        console.error("Error stringifying patient data:", error);
      }

      // Navigate to the submission success page with the caseId and diagnosis using query params
      const queryParams = new URLSearchParams({
        caseId: caseId,
        studentAnswer: examData?.diagnosis || "",
        correctAnswer: completionData.disease || "",
        score: completionData.score?.toString() || "0",
        evaluationMetricScores: JSON.stringify(evaluationData),
        patientData: patientDataString,
      }).toString();

      console.log("Passing data to success page:", {
        evaluationMetricScores: JSON.stringify(evaluationData),
        patientData: patientDataString,
      });

      router.push(`/submission_success?${queryParams}`);
    } catch (error) {
      console.error("Submission error:", error);

      // Display error message to state for rendering in UI
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Failed to submit data. Please try again later."
        );
        alert(
          error.message || "Failed to submit data. Please try again later."
        );
      } else {
        setErrorMessage("Failed to submit data. Please try again later.");
        alert("Failed to submit data. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-green-300 p-6 rounded-2xl shadow-lg w-[883px] h-[185px]">
      <h2 className="font-bold text-lg">Chat History Section</h2>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 mb-2">
          <p className="font-medium">Error: {errorMessage}</p>
        </div>
      )}
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={() => setShowChatModal(true)}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition transform hover:bg-gray-100 hover:scale-105"
        >
          View Chat History
        </button>
        <button
          type="button"
          onClick={() => setShowExamModal(true)}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition transform hover:bg-gray-100 hover:scale-105"
        >
          View Exam Answer
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg transition transform hover:bg-gray-900 hover:scale-105"
        >
          Previous
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg transition transform hover:bg-blue-700 hover:scale-105"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Chat History Modal */}
      {showChatModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80 z-50">
          <div className="bg-blue-50 rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 text-gray-900">
            <div className="flex justify-between items-center border-b border-blue-200 pb-4 mb-4">
              <h2 className="text-2xl font-semibold">Temporary Chat History</h2>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="text-gray-600 hover:text-gray-800 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {chatHistory && chatHistory.length > 0 ? (
                <ul className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <li key={index} className="border-b border-blue-200 pb-2">
                      <span className="font-bold">
                        {message.sender === "patient" ? "Patient" : "Student"}:
                      </span>
                      <span className="ml-2">{message.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No chat history available.</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="bg-blue-600 text-white px-5 py-2 rounded-md transition hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Answer Modal */}
      {showExamModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80 z-50">
          <div className="bg-blue-50 rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 text-gray-900">
            <div className="flex justify-between items-center border-b border-blue-200 pb-4 mb-4">
              <h2 className="text-2xl font-semibold">Temporary Exam Answer</h2>
              <button
                onClick={() => setShowExamModal(false)}
                className="text-gray-600 hover:text-gray-800 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {examData ? (
                <div className="space-y-4">
                  <p>
                    <strong>Patient&apos;s Name:</strong> {examData.patientName}
                  </p>
                  <p>
                    <strong>Age:</strong> {examData.age}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {examData.symptoms}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {examData.diagnosis}
                  </p>
                  <p>
                    <strong>Medications:</strong> {examData.medications}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No exam answer available.</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowExamModal(false)}
                className="bg-blue-600 text-white px-5 py-2 rounded-md transition hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
