import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import ChatMode from "./ChatMode";
import ExamMode from "./ExamMode";
import PatientInfo from "./Patientinfo";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PatientModel from "../components/PatientModel";

type Message = { sender: string; text: string };

type ExamDataType = {
  patientName: string;
  age: string;
  symptoms: string;
  diagnosis: string;
  medications: string;
};

type ChatInterfaceProps = {
  patientName?: string;
  patientMessage: string;
  options: string[];
  onOptionSelect: (option: string) => void;
  onExamSubmitComplete?: (examData: ExamDataType, messages: Message[]) => void;
  // Optional props for pre-populating fields when editing answers
  initialMessages?: Message[];
  initialExamData?: ExamDataType;
};

const socket = io("http://localhost:5000");

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  patientName = "Johnson William",
  patientMessage,
  options,
  onOptionSelect,
  onExamSubmitComplete,
  initialMessages,
  initialExamData,
}) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize state with props if provided.
  const [chatStarted, setChatStarted] = useState<boolean>(!!initialMessages);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages
      ? initialMessages
      : [{ sender: "patient", text: patientMessage }]
  );
  const [inputText, setInputText] = useState("");
  const [activeMode, setActiveMode] = useState<"chat" | "exam">("chat");
  const [examData, setExamData] = useState<ExamDataType>(
    initialExamData
      ? initialExamData
      : {
          patientName: "",
          age: "",
          symptoms: "",
          diagnosis: "",
          medications: "",
        }
  );
  const [showExamSubmitPopup, setShowExamSubmitPopup] = useState(false);

  // When initialMessages prop changes, update the messages state.
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      setChatStarted(true);
    }
  }, [initialMessages]);

  // When initialExamData prop changes, update the examData state.
  useEffect(() => {
    if (initialExamData) {
      setExamData(initialExamData);
    }
  }, [initialExamData]);

  useEffect(() => {
    socket.on("response", (data: string) => {
      setMessages((prev) => [...prev, { sender: "patient", text: data }]);
    });

    return () => {
      socket.off("response");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Chat mode handlers
  const handleOptionSelect = (option: string) => {
    setChatStarted(true);
    setMessages((prev) => [...prev, { sender: "student", text: option }]);
    socket.emit("message", option); // Send the selected message to the server
    onOptionSelect(option);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages((prev) => [...prev, { sender: "student", text: inputText }]);
      socket.emit("message", inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Exam mode handler
  const handleExamDataChange = (field: keyof ExamDataType, value: string) => {
    setExamData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[70%] h-[69%] flex flex-row relative">
      <PatientInfo />
      <div className="flex flex-col w-full ml-4">
        {/* Mode buttons arranged side by side */}
        <div className="flex items-center gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg shadow-md ${
              activeMode === "chat"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            disabled
          >
            Chat
          </button>
          <button
            className={`px-4 py-2 rounded-lg shadow-md ${
              activeMode === "exam"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            disabled
          >
            Exam
          </button>
        </div>
        {activeMode === "chat" ? (
          <>
            <ChatMode
              patientName={patientName}
              messages={messages}
              inputText={inputText}
              onSendMessage={handleSendMessage}
              onInputChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 mt-4"
              onClick={() => setActiveMode("exam")}
            >
              Complete Chat
            </button>
          </>
        ) : (
          <ExamMode
            examData={examData}
            onExamDataChange={handleExamDataChange}
            onBackToChat={() => {}}
            onSubmitExam={() => setShowExamSubmitPopup(true)}
            showSubmitPopup={showExamSubmitPopup}
            setShowSubmitPopup={setShowExamSubmitPopup}
            onConfirmSubmit={() => {
              setShowExamSubmitPopup(false);
              if (onExamSubmitComplete) {
                onExamSubmitComplete(examData, messages);
              }
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
  const handleSpeak = (text: string) => {
    setSpeech(text);
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col relative">
      {/* Mode buttons arranged side by side */}
      <div className="flex items-center gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            activeMode === "chat"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={() => setActiveMode("chat")}
        >
          Chat
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            activeMode === "exam"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={() => setActiveMode("exam")}
        >
          Exam
        </button>
      </div>
      {activeMode === "chat" ? (
        <ChatMode
          patientName={patientName}
          messages={messages}
          inputText={inputText}
          options={options}
          chatStarted={chatStarted}
          onSendMessage={handleSendMessage}
          onInputChange={(e) => setInputText(e.target.value)}
          onOptionSelect={handleOptionSelect}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <ExamMode
          examData={examData}
          onExamDataChange={handleExamDataChange}
          onBackToChat={() => setActiveMode("chat")}
          onSubmitExam={() => setShowExamSubmitPopup(true)}
          showSubmitPopup={showExamSubmitPopup}
          setShowSubmitPopup={setShowExamSubmitPopup}
          onConfirmSubmit={() => {
            setShowExamSubmitPopup(false);
            if (onExamSubmitComplete) {
              onExamSubmitComplete(examData, messages);
            }
          }}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
