"use client";
import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
import Background from "../components/case/background";
import ChatInterface from "../components/case/chat";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const patientMessage =
    "Hello, doctor. I've been feeling unwell for the past few days. I have a persistent cough and a fever...";

  const options = [
    "Do you think you have pneumonia?",
    "Have you eaten anything unusual that might have caused this?",
    "Can you describe your cough? Is it dry, or are you producing phlegm?",
  ];

  return (
    <div className="relative w-full h-screen">
      <Navbar2 />
      <Background>
        <div className="flex items-center justify-center h-screen">
          <ChatInterface
            patientMessage={patientMessage}
            options={options}
            onOptionSelect={(option) => setSelectedOption(option)}
          />
        </div>
      </Background>
    </div>
  );
};

export default Page;
