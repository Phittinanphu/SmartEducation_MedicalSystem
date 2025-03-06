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
  onEditAnswer: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  examData,
  chatHistory,
  onPrevious,
  onEditAnswer,
}) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  // Function to handle saving data to MongoDB using the temporary data
  const handleSubmit = async () => {

    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // First API call to save exam data
      const examResponse = await fetch("/apiExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examAnswers: examData }),
      });
      
      // Check if exam data save was successful
      if (!examResponse.ok) {
        let errorDetail = "Failed to save exam data";
        try {
          // Try to extract detailed error message from response
          const errorData = await examResponse.json();
          if (errorData.message || errorData.error) {
            errorDetail = `Failed to save exam data: ${errorData.message || errorData.error}`;
          }
        } catch (parseError) {
          // If response can't be parsed as JSON, use status text
          errorDetail = `Failed to save exam data: ${examResponse.statusText || `Status ${examResponse.status}`}`;
        }
        throw new Error(errorDetail);
      }
      
      // Second API call to save chat history
      const chatResponse = await fetch("/apiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: chatHistory }),
      });
      
      // Check if chat history save was successful
      if (!chatResponse.ok) {
        let errorDetail = "Failed to save chat history";
        try {
          // Try to extract detailed error message from response
          const errorData = await chatResponse.json();
          if (errorData.message || errorData.error) {
            errorDetail = `Failed to save chat history: ${errorData.message || errorData.error}`;
          }
        } catch (parseError) {
          // If response can't be parsed as JSON, use status text
          errorDetail = `Failed to save chat history: ${chatResponse.statusText || `Status ${chatResponse.status}`}`;
        }
        throw new Error(errorDetail);
      }
      
      // If both API calls were successful, redirect to success page
      console.log("Data saved successfully");
      router.push("/submission_success");
      
    } catch (error: any) {
      console.error("Submission error:", error);
      // Display error message to state for rendering in UI
      setErrorMessage(error.message || "Failed to submit data. Please try again later.");
      // Also show an alert for immediate notification
      alert(error.message || "Failed to submit data. Please try again later.");
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
          onClick={() => setShowChatModal(true)}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition transform hover:bg-gray-100 hover:scale-105"
        >
          View Chat History
        </button>
        <button
          onClick={() => setShowExamModal(true)}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition transform hover:bg-gray-100 hover:scale-105"
        >
          View Exam Answer
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevious}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg transition transform hover:bg-gray-900 hover:scale-105"
        >
          Previous
        </button>
        <div className="flex gap-2">
          <button
            // When Edit Answer is clicked, immediately call onEditAnswer.
            // The parent component should then render the chat/exam view,
            // passing in the temporary data so that previous chat history and exam answers are loaded.
            onClick={onEditAnswer}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg transition transform hover:bg-yellow-600 hover:scale-105"
          >
            Edit Answer
          </button>
          <button
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
                    <strong>Patient's Name:</strong> {examData.patientName}
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
