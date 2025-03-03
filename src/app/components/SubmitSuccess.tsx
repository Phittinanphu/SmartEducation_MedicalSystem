"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SubmitSucessScreen: React.FC = () => {
  const router = useRouter();


  const HandleViewAnswer = () => {
    router.push("/submission_success"); 
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url('/submit-background.png')`, // Replace with actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay with minimal blur effect */}
      <div className="absolute inset-0 bg-white bg-opacity-5"></div>

      {/* Main Card */}
      <div className="w-646 h-329 relative z-10 bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold text-black mt-2">Submission Successful</h1>

        {/* Start Button */}
        
        <button
        onClick={HandleViewAnswer}
        className="w-227 h-50 mt-6 bg-red-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300"
        >
        View Answer
        </button>
        
      </div>
    </div>
  );
};

export default SubmitSucessScreen;
