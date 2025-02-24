import React, { useState, useEffect } from "react";

interface ChatHistoryProps {
  onPrevious: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onPrevious }) => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [chatHistoryData, setChatHistoryData] = useState<any>(null);
  const [examAnswerData, setExamAnswerData] = useState<any>(null);

  // Fetch the latest chat history when the chat modal opens
  useEffect(() => {
    if (showChatModal) {
      fetch("/apiChat")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Take the first record as the latest chat history
            setChatHistoryData(data.data[0]);
          } else {
            console.error("Error fetching chat history:", data.error);
          }
        })
        .catch((err) => console.error("Error fetching chat history:", err));
    }
  }, [showChatModal]);

  // Fetch the latest exam answer when the exam modal opens
  useEffect(() => {
    if (showExamModal) {
      fetch("/apiExam")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Take the first record as the latest exam answer
            setExamAnswerData(data.data[0]);
          } else {
            console.error("Error fetching exam answers:", data.error);
          }
        })
        .catch((err) => console.error("Error fetching exam answers:", err));
    }
  }, [showExamModal]);

  return (
    <div className="bg-green-300 p-6 rounded-2xl shadow-lg w-[883px] h-[185px]">
      <h2 className="font-bold text-lg">Chat History Section</h2>
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
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg transition transform hover:bg-blue-700 hover:scale-105">
          Submit
        </button>
      </div>

      {/* Chat History Modal */}
      {showChatModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80 z-50">
          <div className="bg-blue-50 rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 text-gray-900">
            <div className="flex justify-between items-center border-b border-blue-200 pb-4 mb-4">
              <h2 className="text-2xl font-semibold">Latest Chat History</h2>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-600 hover:text-gray-800 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {chatHistoryData && chatHistoryData.chatHistory ? (
                <ul className="space-y-4">
                  {chatHistoryData.chatHistory.map((message: any, index: number) => (
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
              <h2 className="text-2xl font-semibold">Latest Exam Answer</h2>
              <button
                onClick={() => setShowExamModal(false)}
                className="text-gray-600 hover:text-gray-800 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {examAnswerData && examAnswerData.examAnswers ? (
                <div className="space-y-4">
                  <p>
                    <strong>Patient's Name:</strong> {examAnswerData.examAnswers.patientName}
                  </p>
                  <p>
                    <strong>Age:</strong> {examAnswerData.examAnswers.age}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {examAnswerData.examAnswers.symptoms}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {examAnswerData.examAnswers.diagnosis}
                  </p>
                  <p>
                    <strong>Medications:</strong> {examAnswerData.examAnswers.medications}
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
