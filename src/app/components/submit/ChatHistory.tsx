import React from "react";

interface ChatHistoryProps {
  onPrevious: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onPrevious }) => {
  return (
    <div
      className="bg-green-300 p-6 rounded-2xl shadow-lg"
      style={{ width: "883px", height: "185px" }}
    >
      <h2 className="font-bold text-lg">Chat History Section</h2>
      <div className="flex justify-center gap-4 mt-4">
        <button 
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition-transform transform hover:bg-gray-100 hover:scale-105"
        >
          View Chat History
        </button>
        <button 
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow border border-gray-400 transition-transform transform hover:bg-gray-100 hover:scale-105"
        >
          Edit Conversation
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button 
          className="bg-gray-800 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-gray-900 hover:scale-105"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-blue-700 hover:scale-105"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;





