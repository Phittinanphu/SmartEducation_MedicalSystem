"use client";
import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
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

  // Temporary data from the ChatInterface
  const [examData, setExamData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeMode, setActiveMode] = useState("chat");

  // Callback from ChatInterface when the exam is submitted.
  // It saves the temporary data and switches to the submission view.
  const handleExamSubmitComplete = (examAnswers, messages) => {
    setExamData(examAnswers);
    setChatMessages(messages);
    setSubmitted(true);
    setStep(1);
  };

  // onEditAnswer callback: switch to the exam view without restarting the page.
  const handleEditAnswer = () => {
    setSubmitted(false);
    setActiveMode("exam");
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
        <div className="flex h-full bg-blue-100">
          <div className="w-full h-full">
            <ChatInterface
              onExamSubmitComplete={handleExamSubmitComplete}
              initialExamData={examData ? examData : undefined}
              activeMode={activeMode}
              setActiveMode={setActiveMode}
            />
          </div>
        </div>
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
                onEditAnswer={handleEditAnswer}
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
