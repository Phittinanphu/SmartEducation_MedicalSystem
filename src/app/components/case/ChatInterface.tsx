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
import Patient2D from "../Patient2D"; // ✅ Import Patient2D

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
  const [chatStarted, setChatStarted] = useState<boolean>(!!initialMessages);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages ? initialMessages : [{ sender: "patient", text: patientMessage }]
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
  const [patientMood, setPatientMood] = useState<"angry" | "happy" | "normal" | "sad" | "scared">("normal");

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
      setChatStarted(true);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (initialExamData) {
      setExamData(initialExamData);
    }
  }, [initialExamData]);

  useEffect(() => {
    socket.on("response", (data: string) => {
      setMessages((prev) => [...prev, { sender: "patient", text: data }]);
      updatePatientMood(data); // ✅ อัปเดตอารมณ์ของผู้ป่วยตามข้อความที่ได้รับ
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

  const handleOptionSelect = (option: string) => {
    setChatStarted(true);
    setMessages((prev) => [...prev, { sender: "student", text: option }]);
    socket.emit("message", option);
    onOptionSelect(option);

    updatePatientMood(option); // ✅ อัปเดตอารมณ์ของผู้ป่วยตามตัวเลือกที่เลือก
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages((prev) => [...prev, { sender: "student", text: inputText }]);
      socket.emit("message", inputText);
      updatePatientMood(inputText); // ✅ อัปเดตอารมณ์ของผู้ป่วยตามข้อความที่ส่ง
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleExamDataChange = (field: keyof ExamDataType, value: string) => {
    setExamData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ ฟังก์ชันวิเคราะห์อารมณ์ข้อความ
  const updatePatientMood = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("angry") || lowerText.includes("mad")) setPatientMood("angry");
    else if (lowerText.includes("happy") || lowerText.includes("good") || lowerText.includes("relieved")) setPatientMood("happy");
    else if (lowerText.includes("sad") || lowerText.includes("depressed") || lowerText.includes("cry")) setPatientMood("sad");
    else if (lowerText.includes("scared") || lowerText.includes("afraid") || lowerText.includes("nervous")) setPatientMood("scared");
    else setPatientMood("normal");
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
      <div className="flex items-center gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            activeMode === "chat" ? "bg-blue-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={() => setActiveMode("chat")}
        >
          Chat
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow-md ${
            activeMode === "exam" ? "bg-blue-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
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

      {/* ✅ แสดงอารมณ์ของผู้ป่วยตามแชท */}
      <div className="absolute top-0 right-[-500px] w-[500px] h-auto">
        <Patient2D mood={patientMood} />
      </div>
    </div>
  );
};

export default ChatInterface;
