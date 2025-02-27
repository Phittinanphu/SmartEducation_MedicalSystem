"use client";
import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
import ChatBackground from "../components/case/background";
import SubmitBackground from "../components/submit/Background";
import ChatInterface from "../components/case/ChatInterface";
import SubmitInstructions from "../components/submit/SubmitInstructions";
import PatientDetails from "../components/submit/PatientDetails";
import ChatHistory from "../components/submit/ChatHistory";

const Page = () => {
  // Tracks whether the exam submission process is complete.
  const [submitted, setSubmitted] = useState(false);
  // Step state for the submission multi‑step view:
  // 1 = Submit Instructions, 2 = Patient Details, 3 = Chat History
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");

  // Temporary data from the ChatInterface
  const [examData, setExamData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const patientMessage =
    "Hello, doctor. I've been feeling unwell for the past few days. I have a persistent cough and a fever...";

  const options = [
    "Do you think you have pneumonia?",
    "Have you eaten anything unusual that might have caused this?",
    "Can you describe your cough? Is it dry, or are you producing phlegm?",
  ];

  // Callback from ChatInterface when the exam is submitted.
  // It saves the temporary data and switches to the submission view.
  const handleExamSubmitComplete = (examAnswers, messages) => {
    setExamData(examAnswers);
    setChatMessages(messages);
    setSubmitted(true);
    setStep(1);
  };

  // onEditAnswer callback: switch back to the chat/exam view.
  // The temporary data is passed into ChatInterface so the student can continue editing.
  const handleEditAnswer = () => {
    setSubmitted(false);
  };

  // Handlers for the submission multi‑step navigation.
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 1) {
      // If on the first step, going back returns to the chat/exam view.
      setSubmitted(false);
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Navbar2 />
      {!submitted ? (
        // Chat/Exam view
        <ChatBackground>
          <div className="flex h-full">
            <div className="w-[100%]">
              <ChatInterface
                patientMessage={patientMessage}
                options={options}
                onOptionSelect={(option) => setSelectedOption(option)}
                onExamSubmitComplete={handleExamSubmitComplete}
                // When starting for the first time, temporary data is not provided,
                // so ChatInterface will load default values and show the three option blocks.
                // In case of Edit Answer, the temporary data (if any) is passed.
                initialMessages={
                  chatMessages && chatMessages.length > 0 ? chatMessages : undefined
                }
                initialExamData={examData ? examData : undefined}
              />
            </div>
            <div className="flex-1">
              {/* Patient animation area goes here */}
            </div>
          </div>
        </ChatBackground>
      ) : (
        // Submission multi‑step view
        <SubmitBackground>
          <div className="flex flex-col items-center gap-6 mt-[-80px]">
            {step >= 1 && (
              <SubmitInstructions
                active={step === 1}
                onNext={step === 1 ? handleNext : undefined}
                onPrevious={step === 1 ? handlePrevious : undefined}
              />
            )}
            {step >= 2 && (
              <PatientDetails
                active={step === 2}
                onNext={step === 2 ? handleNext : undefined}
                onPrevious={step === 2 ? handlePrevious : undefined}
              />
            )}
            {step >= 3 && (
              <ChatHistory
                active={step === 3}
                onPrevious={step === 3 ? handlePrevious : undefined}
                onEditAnswer={step === 3 ? handleEditAnswer : undefined}
                examData={examData}
                chatHistory={chatMessages}
              />
            )}
          </div>
        </SubmitBackground>
      )}
    </div>
  );
};

export default Page;
