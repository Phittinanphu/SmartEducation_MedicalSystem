"use client";
import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
// ChatBackground is used for the chat/exam view
import ChatBackground from "../components/case/background";
// SubmitBackground is used for the submission multi‑step view
import SubmitBackground from "../components/submit/Background";
import ChatInterface from "../components/case/ChatInterface";
import SubmitInstructions from "../components/submit/SubmitInstructions";
import PatientDetails from "../components/submit/PatientDetails";
import ChatHistory from "../components/submit/ChatHistory";

const Page = () => {
  // State to track whether the student has submitted exam answers
  const [submitted, setSubmitted] = useState(false);
  // Step state for the multi‑step submission view:
  // 1 = Submit Instructions, 2 = Patient Details, 3 = Chat History
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");

  // New state to hold exam data and chat history from ChatInterface
  const [examData, setExamData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const patientMessage =
    "Hello, doctor. I've been feeling unwell for the past few days. I have a persistent cough and a fever...";

  const options = [
    "Do you think you have pneumonia?",
    "Have you eaten anything unusual that might have caused this?",
    "Can you describe your cough? Is it dry, or are you producing phlegm?",
  ];

  // Callback passed to ChatInterface.
  // When exam submission is complete, ChatInterface passes its exam answers and chat messages.
  const handleExamSubmitComplete = (examAnswers, messages) => {
    setExamData(examAnswers);
    setChatMessages(messages);
    setSubmitted(true);
    // Reset the submission flow step to 1
    setStep(1);
  };

  // Handlers for the submission multi‑step view
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 1) {
      // If the user wants to go back from the first submission step,
      // return to the chat/exam view.
      setSubmitted(false);
    } else {
      setStep(step - 1);
    }
  };

  // Handler for editing answers from the Chat History step.
  // It switches back to the chat/exam view so students can modify their answers.
  const handleEditAnswer = () => {
    setSubmitted(false);
  };

  return (
    <div className="relative w-full h-screen">
      <Navbar2 />
      {!submitted ? (
        // Chat/Exam view
        <ChatBackground>
          <div className="flex h-full">
            {/* Left side: Chat/Exam area */}
            <div className="w-[100%]">
              <ChatInterface
                patientMessage={patientMessage}
                options={options}
                onOptionSelect={(option) => setSelectedOption(option)}
                // When exam submission is complete in ChatInterface,
                // it calls this callback with exam data and chat messages.
                onExamSubmitComplete={handleExamSubmitComplete}
              />
            </div>
            {/* Right side: Reserved for patient animation */}
            <div className="flex-1">
              {/* Patient animation area goes here */}
            </div>
          </div>
        </ChatBackground>
      ) : (
        // Submission multi‑step view
        <SubmitBackground>
          <div className="flex flex-col items-center gap-6 mt-[-80px]">
            {/* Render Submit Instructions if step >= 1.
                Only pass navigation props when active (step === 1). */}
            {step >= 1 && (
              <SubmitInstructions
                active={step === 1}
                onNext={step === 1 ? handleNext : undefined}
                onPrevious={step === 1 ? handlePrevious : undefined}
              />
            )}
            {/* Render Patient Details if step >= 2 */}
            {step >= 2 && (
              <PatientDetails
                active={step === 2}
                onNext={step === 2 ? handleNext : undefined}
                onPrevious={step === 2 ? handlePrevious : undefined}
              />
            )}
            {/* Render Chat History if step >= 3 */}
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
