// ChatInterface.tsx
import React, { useState } from "react";

type ChatInterfaceProps = {
  patientName?: string;
  patientMessage: string;
  options: string[];
  onOptionSelect: (option: string) => void;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  patientName = "Johnson William",
  patientMessage,
  options,
  onOptionSelect,
}) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([{ sender: "patient", text: patientMessage }]);
  const [inputText, setInputText] = useState("");

  const handleOptionSelect = (option: string) => {
    setChatStarted(true);
    setMessages([...messages, { sender: "student", text: option }]);
    onOptionSelect(option);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, { sender: "student", text: inputText }]);
      setInputText("");
      // Here, you can integrate the LLM response handling
    }
  };

  return (
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col justify-between">
      {/* Patient's Message or Chat */}
      <div className="bg-gray-100 p-4 rounded-lg text-black flex-1 overflow-y-auto">
        <p className="font-bold text-blue-600">{patientName}</p>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-2xl max-w-[75%] w-fit ${
              msg.sender === "patient"
                ? "bg-gray-200 text-left self-start hover:bg-gray-300"
                : "bg-blue-500 text-white self-end hover:bg-blue-600"
            }`}
            style={{
              alignSelf: msg.sender === "student" ? "flex-end" : "flex-start",
              marginLeft: msg.sender === "student" ? "auto" : "0",
              marginRight: msg.sender === "student" ? "0" : "auto",
              textAlign: msg.sender === "student" ? "right" : "left",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      
      {/* Chat Input */}
      {chatStarted ? (
        <div className="flex items-center gap-2 border-t pt-2">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-auto">
          {options.map((option, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;


