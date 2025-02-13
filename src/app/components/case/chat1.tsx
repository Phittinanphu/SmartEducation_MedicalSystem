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
  const [showPopup, setShowPopup] = useState(false);
  const [showAnswerButton, setShowAnswerButton] = useState(false);
  const [examMode, setExamMode] = useState(false);

  const handleOptionSelect = (option: string) => {
    setChatStarted(true);
    setShowAnswerButton(true);
    setMessages([...messages, { sender: "student", text: option }]);
    onOptionSelect(option);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, { sender: "student", text: inputText }]);
      setInputText("");
    }
  };

  const handleConfirmAnswer = () => {
    setShowPopup(false);
    setExamMode(true);
  };

  if (examMode) {
    return (
      <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col">
        <h2 className="text-xl font-bold text-center">Exam Section</h2>
        <div className="flex flex-col gap-4 mt-4 flex-1">
          <label>
            <span className="font-semibold">Patient's Name:</span>
            <input type="text" className="border rounded-lg p-2 w-full" placeholder="Enter patient's name" />
          </label>
          <label>
            <span className="font-semibold">Age:</span>
            <input type="number" className="border rounded-lg p-2 w-full" placeholder="Enter age" />
          </label>
          <label>
            <span className="font-semibold">Primary Symptoms:</span>
            <textarea className="border rounded-lg p-2 w-full" placeholder="Describe symptoms"></textarea>
          </label>
          <label>
            <span className="font-semibold">Diagnosis (if applicable):</span>
            <input type="text" className="border rounded-lg p-2 w-full" placeholder="Enter diagnosis" />
          </label>
          <label>
            <span className="font-semibold">Medications Prescribed:</span>
            <input type="text" className="border rounded-lg p-2 w-full" placeholder="Enter medications" />
          </label>
        </div>
        <button className="bg-red-600 font-bold text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 mt-4 self-center">
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col justify-between">
      <div className="bg-gray-100 p-4 rounded-lg text-black flex-1 overflow-y-auto space-y-3">
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
      {!chatStarted && (
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
      <div className="flex flex-col gap-3 border-t pt-2">
        {chatStarted && (
          <>
            <div className="flex items-center gap-2">
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
            {showAnswerButton && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700"
                onClick={() => setShowPopup(true)}
              >
                Answer
              </button>
            )}
          </>
        )}
      </div>
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold">Are you sure to answer?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800" onClick={() => setShowPopup(false)}>NO</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700" onClick={handleConfirmAnswer}>YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;


