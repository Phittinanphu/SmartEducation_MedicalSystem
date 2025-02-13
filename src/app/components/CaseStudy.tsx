"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CaseStudyScreen: React.FC = () => {
  const router = useRouter();

  // Handle navigation when Start button is clicked
  const handleStart = () => {
    router.push("/case-studies"); // Navigate to the study cases page
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url('/hospital-background.png')`, // Replace with actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay with minimal blur effect */}
      <div className="absolute inset-0 bg-white bg-opacity-5"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg w-full">
        <p className="text-lg font-bold text-black mt-2">Welcome to</p>
        <h1 className="text-4xl font-bold text-black mt-2">Study cases</h1>

        {/* Start Button */}
        <Link href="/chat">
          <button
            onClick={handleStart}
            className="mt-6 bg-red-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Start
          </button>
        </Link>
        </div>
      </div>
  );
};

export default CaseStudyScreen;


