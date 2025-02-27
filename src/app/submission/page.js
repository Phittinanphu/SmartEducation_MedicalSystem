"use client";

import React, { useState } from "react";
import Background from "../components/submit/Background";
import SubmitInstructions from "../components/submit/SubmitInstructions";
import PatientDetails from "../components/submit/PatientDetails";
import ChatHistory from "../components/submit/ChatHistory";
import Navbar2 from "../components/Navbar2";
import { useRouter } from "next/navigation";

const Page = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step === 1) {
      router.push("/exam-section");
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Navbar2 />
      <Background>
        <div className="flex flex-col items-center gap-6 mt-[-80px]">
          {step >= 1 && (
            <SubmitInstructions
              active={step === 1}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {step >= 2 && (
            <PatientDetails
              active={step === 2}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {step >= 3 && (
            <ChatHistory active={step === 3} onPrevious={handlePrevious} />
          )}
        </div>
      </Background>
    </div>
  );
};

export default Page;
