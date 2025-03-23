"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface SubmitSuccessProps {
  caseId: string;
  studentAnswer?: string;
  correctAnswer?: string;
  score?: string;
  evaluationMetricScores?: string;
  patientData?: {
    Age?: string;
    Name?: string;
    Occupation?: string;
    Reason?: string;
    Sex?: string;
    Symptoms?: string;
    Gender?: string; // Alternative field name
    mood?: "normal" | "happy" | "sad" | "angry" | "scared";
    [key: string]: string | undefined; // More specific type for additional fields
  };
}

const SubmitSuccessScreen: React.FC<SubmitSuccessProps> = ({
  caseId,
  studentAnswer,
  correctAnswer,
  score,
  evaluationMetricScores,
  patientData,
}) => {
  const router = useRouter();

  const navigateToEvaluation = (view?: string) => {
    console.log(
      "Original evaluationMetricScores in SubmitSuccess:",
      evaluationMetricScores
    );
    console.log("Patient data in SubmitSuccess:", patientData);

    // This temporary placeholder will be replaced by actual data when the backend is updated
    const conversationData = [
      {
        question: "This function is currently unavailable.",
        comment: "This function is currently unavailable.",
      },
    ];

    // Create an object with all parameters that will be included
    const paramsObj: Record<string, string> = {
      caseId,
      case: correctAnswer || "",
    };

    // Only add these parameters if they are defined
    if (studentAnswer) paramsObj.studentAnswer = studentAnswer;
    if (correctAnswer) paramsObj.correctAnswer = correctAnswer;
    if (score) paramsObj.score = score;
    if (evaluationMetricScores)
      paramsObj.evaluationMetricScores = evaluationMetricScores;
    if (view) paramsObj.view = view;

    // Always stringify the conversation data
    paramsObj.conversationData = JSON.stringify(conversationData);

    // Carefully handle the patient data to ensure it's stringified correctly
    if (patientData && Object.keys(patientData).length > 0) {
      try {
        paramsObj.patientData = JSON.stringify(patientData);
        console.log("Stringified patient data:", paramsObj.patientData);
      } catch (error) {
        console.error("Error stringifying patient data:", error);
        paramsObj.patientData = JSON.stringify({});
      }
    } else {
      console.warn("No patient data available to pass to evaluation page");
      paramsObj.patientData = JSON.stringify({});
    }

    const queryParams = new URLSearchParams(paramsObj).toString();

    console.log("Passing data to evaluation page:", {
      conversationData: JSON.stringify(conversationData),
      patientData: paramsObj.patientData,
    });
    router.push(`/evaluation_page?${queryParams}`);
  };

  const HandleViewAnswer = () => {
    navigateToEvaluation();
  };

  const HandleBackToHome = () => {
    router.push("/main");
  };

  const HandleViewConversation = () => {
    navigateToEvaluation("conversation");
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
      <div className="w-646 h-500 relative z-10 bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold text-black mt-2">
          Submission Successful
        </h1>
        <p className="text-2xl text-black mt-4">
          <strong>Correct Answer:</strong>{" "}
          <span className="text-red-500">{correctAnswer}</span>
        </p>

        {/* Button */}
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            type="button"
            onClick={HandleBackToHome}
            className="w-227 h-50 mt-6 bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Back To Home
          </button>
          <button
            type="button"
            onClick={HandleViewConversation}
            className="w-227 h-50 mt-6 bg-purple-400 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            View Conversation
          </button>
          <button
            type="button"
            onClick={HandleViewAnswer}
            className="w-227 h-50 mt-6 bg-green-400 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            View Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccessScreen;
