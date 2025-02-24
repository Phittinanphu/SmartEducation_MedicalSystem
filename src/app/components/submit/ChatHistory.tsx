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
            // Assuming records are sorted descending, take the first element.
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
            setExamAnswerData(data.data[0]);
          } else {
            console.error("Error fetching exam answers:", data.error);
          }
        })
        .catch((err) => console.error("Error fetching exam answers:", err));
    }
  }, [showExamModal]);

  return (
    <div
      className="bg-green-300 p-6 rounded-2xl shadow-lg"
      style={{ width: "883px", height: "185px" }}
    >
      <h2 className="font-bold text-lg">Chat History Section</h2>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setShowChatModal(true)}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition-transform transform hover:bg-gray-100 hover:scale-105"
        >
          View Chat History
        </button>
        <button
          onClick={() => setShowExamModal(true)}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition-transform transform hover:bg-gray-100 hover:scale-105"
        >
          View Exam Answer
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevious}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-gray-900 hover:scale-105"
        >
          Previous
        </button>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-blue-700 hover:scale-105"
        >
          Submit
        </button>
      </div>

      {/* Chat History Modal */}
      {showChatModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Latest Chat History</h2>
            <div className="max-h-80 overflow-y-auto">
              {chatHistoryData ? (
                <pre>{JSON.stringify(chatHistoryData, null, 2)}</pre>
              ) : (
                <p>Loading chat history...</p>
              )}
            </div>
            <button
              onClick={() => setShowChatModal(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Exam Answer Modal */}
      {showExamModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Latest Exam Answer</h2>
            <div className="max-h-80 overflow-y-auto">
              {examAnswerData ? (
                <pre>{JSON.stringify(examAnswerData, null, 2)}</pre>
              ) : (
                <p>Loading exam answer...</p>
              )}
            </div>
            <button
              onClick={() => setShowExamModal(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
