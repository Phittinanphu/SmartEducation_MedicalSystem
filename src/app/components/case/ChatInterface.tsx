import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ChatMode from "./ChatMode";
import ExamMode from "./ExamMode";

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
  const [activeMode, setActiveMode] = useState<"chat" | "exam">("chat");
  const [examData, setExamData] = useState({
    patientName: "",
    age: "",
    symptoms: "",
    diagnosis: "",
    medications: "",
  });
  const [showExamSubmitPopup, setShowExamSubmitPopup] = useState(false);
  const router = useRouter();

  // Chat mode handlers
  const handleOptionSelect = (option: string) => {
    setChatStarted(true);
    setMessages((prev) => [...prev, { sender: "student", text: option }]);
    onOptionSelect(option);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages((prev) => [...prev, { sender: "student", text: inputText }]);
      setInputText("");
    }
  };

  // Exam mode handlers
  const handleExamDataChange = (field: keyof typeof examData, value: string) => {
    setExamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExamConfirmSubmit = async () => {
    setShowExamSubmitPopup(false);
    try {
      const examResponse = await fetch("/apiExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examAnswers: examData }),
      });
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
        />
      ) : (
        <ExamMode
          examData={examData}
          onExamDataChange={handleExamDataChange}
          onBackToChat={() => setActiveMode("chat")}
          onSubmitExam={() => setShowExamSubmitPopup(true)}
          showSubmitPopup={showExamSubmitPopup}
          setShowSubmitPopup={setShowExamSubmitPopup}
          onConfirmSubmit={handleExamConfirmSubmit}
        />
      )}
    </div>
  );
};

export default ChatInterface;
