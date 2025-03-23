import React, { useState, useEffect, useRef } from "react";
import ChatMode from "./ChatMode";
import ExamMode from "./ExamMode";
import PatientInfo from "./Patientinfo";
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
  onExamSubmitComplete?: (examData: ExamDataType, messages: Message[]) => void;
  initialMessages?: Message[];
  initialExamData?: ExamDataType;
  patientData: {
    Age: string;
    Name: string;
    Occupation: string;
    Reason: string;
    Sex: string;
    Symptoms: string;
  };
  caseId: string;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  patientName = "Johnson William",
  patientMessage,
  onExamSubmitComplete,
  initialMessages,
  initialExamData,
  patientData,
  caseId,
}) => {
  const BE_DNS = process.env.NEXT_PUBLIC_BE_DNS;
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (initialExamData) {
      setExamData(initialExamData);
    }
  }, [initialExamData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      setMessages((prev) => [...prev, { sender: "student", text: inputText }]);
      setInputText("");

      try {
        const response = await fetch(`${BE_DNS}/chat/continue`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ case_id: caseId, message: inputText }),
        });
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { sender: "patient", text: data.response },
        ]);
      } catch (error) {
        console.error("Error sending message to FastAPI:", error);
      }
    }
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleExamDataChange = (field: keyof ExamDataType, value: string) => {
    setExamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExamSubmit = () => {
    if (onExamSubmitComplete) {
      onExamSubmitComplete(examData, messages);
    }
  };

  return (
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[80%] h-[90%] flex flex-row relative">
      <PatientInfo patientData={patientData} />
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
            onBackToChat={() => setActiveMode("chat")}
            onSubmitExam={() => setShowExamSubmitPopup(true)}
            showSubmitPopup={showExamSubmitPopup}
            setShowSubmitPopup={setShowExamSubmitPopup}
            onConfirmSubmit={handleExamSubmit}
          />
        )}
        <div ref={messagesEndRef} />
        <div className="absolute top-[160px] right-[-300px] w-[300px] h-auto scale-150 translate-x-10">
          <Patient2D mood="normal" />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
