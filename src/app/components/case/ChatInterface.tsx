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

const ChatInterface = () => {
  const [speech, setSpeech] = useState("");

type ExamDataType = {
  patientName: string;
  age: string;
  symptoms: string;
  diagnosis: string;
  medications: string;
};

type ChatInterfaceProps = {
  patientName?: string;
  onOptionSelect: (option: string) => void;
  onExamSubmitComplete?: (examData: ExamDataType, messages: Message[]) => void;
  initialExamData?: ExamDataType;
  activeMode: "chat" | "exam";
  setActiveMode: (mode: "chat" | "exam") => void;
};

const socket = io("http://localhost:5000");

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  patientName = "Johnson William",
  onExamSubmitComplete,
  initialExamData,
  activeMode,
  setActiveMode,
}) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize state with props if provided.
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
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
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* ส่วนแชท */}
      <div style={{ flex: 1, padding: "20px", background: "#f4f4f4" }}>
        <h2>Chat Interface</h2>
        <button onClick={() => handleSpeak("I can respond to your voice!")}>
          Speak
        </button>
      </div>

      {/* ส่วนโมเดล 3D */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <PatientModel speech={speech} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default ChatInterface;
