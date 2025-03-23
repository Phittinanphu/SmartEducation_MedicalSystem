"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const CaseStudyScreen: React.FC = () => {
  const router = useRouter();
  const userId = Cookies.get("user_id"); // Generate a valid UUID

  // Fetch patient data and navigate to chat page when Start button is clicked
  const handleStart = async () => {
    try {
      const response = await fetch(`${BE_DNS}/chat/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: userId, // Ensure User ID is sent with the correct key
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await response.json();
      console.log(data); // Log the response to the console

      // Navigate to the chat page with patient data as query parameters
      const queryParams = new URLSearchParams({
        case_id: data.case_id,
        Age: data.patient_data.Age,
        Name: data.patient_data.Name,
        Occupation: data.patient_data.Occupation,
        Reason: data.patient_data.Reason,
        Sex: data.patient_data.Sex,
        Symptoms: data.patient_data.Symptoms,
      }).toString();

      router.push(`/chat_page?${queryParams}`);
    } catch (error) {
      console.error("Error:", error);
    }
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
        <button
          onClick={handleStart}
          className="mt-6 bg-red-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default CaseStudyScreen;
