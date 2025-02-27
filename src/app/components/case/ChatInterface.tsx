import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  patientMessage: string;
  options: string[];
  onOptionSelect: (option: string) => void;
  onExamSubmitComplete?: (examData: ExamDataType, messages: Message[]) => void;
  // Optional props for pre-populating fields when editing answers
  initialMessages?: Message[];
  initialExamData?: ExamDataType;
};

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

  // Initialize state with props if provided.
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
          onConfirmSubmit={() => {
            setShowExamSubmitPopup(false);
            if (onExamSubmitComplete) {
              onExamSubmitComplete(examData, messages);
            }
          }}
        />
      )}
    </div>
  );
};

export default ChatInterface;
