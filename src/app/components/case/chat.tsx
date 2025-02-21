import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [examData, setExamData] = useState({
    patientName: "",
    age: "",
    symptoms: "",
    diagnosis: "",
    medications: "",
  });
  const router = useRouter(); // Next.js router for navigation

  // Regular chat mode
  const handleOptionSelect = (option: string) => {
    setChatStarted(true);
    setShowAnswerButton(true);
    setMessages((prevMessages) => [...prevMessages, { sender: "student", text: option }]);
    onOptionSelect(option);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { sender: "student", text: inputText }]);
      setInputText("");
    }
  };

  // Popup before entering exam mode
  const handleConfirmAnswer = () => {
    setShowPopup(false);
    setExamMode(true);
  };

  // Trigger exam submission popup
  const handleExamSubmit = () => {
    setShowPopup(true);
  };

  // Confirm exam submission and save data
  const handleExamConfirmSubmit = async () => {
    setShowPopup(false);
    try {
      // Save exam answers to MongoDB
      const examResponse = await fetch("/apiExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examAnswers: examData }),
      });

      // Save chat history to MongoDB
      const chatResponse = await fetch("/apiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: messages }),
      });

      if (examResponse.ok && chatResponse.ok) {
        console.log("Data saved successfully");
        router.push("/submission");
      } else {
        console.error("Error saving data");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // Exam mode UI
  if (examMode) {
    return (
      <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col">
        <h2 className="text-xl font-bold text-center">Exam Section</h2>
        <div className="flex flex-col gap-4 mt-4 flex-1">
          <label>
            <span className="font-semibold">Patient's Name:</span>
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Enter patient's name"
              value={examData.patientName}
              onChange={(e) => setExamData({ ...examData, patientName: e.target.value })}
            />
          </label>
          <label>
            <span className="font-semibold">Age:</span>
            <input
              type="number"
              className="border rounded-lg p-2 w-full"
              placeholder="Enter age"
              value={examData.age}
              onChange={(e) => setExamData({ ...examData, age: e.target.value })}
            />
          </label>
          <label>
            <span className="font-semibold">Primary Symptoms:</span>
            <textarea
              className="border rounded-lg p-2 w-full"
              placeholder="Describe symptoms"
              value={examData.symptoms}
              onChange={(e) => setExamData({ ...examData, symptoms: e.target.value })}
            ></textarea>
          </label>
          <label>
            <span className="font-semibold">Diagnosis (if applicable):</span>
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Enter diagnosis"
              value={examData.diagnosis}
              onChange={(e) => setExamData({ ...examData, diagnosis: e.target.value })}
            />
          </label>
          <label>
            <span className="font-semibold">Medications Prescribed:</span>
            <input
              type="text"
              className="border rounded-lg p-2 w-full"
              placeholder="Enter medications"
              value={examData.medications}
              onChange={(e) => setExamData({ ...examData, medications: e.target.value })}
            />
          </label>
        </div>
        <button
          className="bg-red-600 font-bold text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 mt-4 self-center"
          onClick={handleExamSubmit}
        >
          Submit
        </button>
        {showPopup && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96 h-40 flex flex-col justify-center">
              <p className="text-lg font-bold">Confirm Answers</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800"
                  onClick={() => setShowPopup(false)}
                >
                  NO
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
                  onClick={handleExamConfirmSubmit}
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular Chat UI
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
      {showPopup && !examMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold">Are you sure to answer?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800"
                onClick={() => setShowPopup(false)}
              >
                NO
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
                onClick={handleConfirmAnswer}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
