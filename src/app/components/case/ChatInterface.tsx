import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import ChatMode from "./ChatMode";
import ExamMode from "./ExamMode";

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
  onOptionSelect: (option: string) => void;
  onExamSubmitComplete?: (examData: ExamDataType, messages: Message[]) => void;
  // Optional props for pre-populating fields when editing answers
  initialExamData?: ExamDataType;
};

const socket = io("http://localhost:5000");

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  patientName = "Johnson William",
  onExamSubmitComplete,
  initialExamData,
}) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize state with props if provided.
  const [messages, setMessages] = useState<Message[]>([]);
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
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col relative">
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
  );
};

export default ChatInterface;
