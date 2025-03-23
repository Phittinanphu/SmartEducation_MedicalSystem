"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface SubmitSuccessProps {
  caseId: string;
  studentAnswer: string;
  correctAnswer: string;
  score: string;
  evaluationMetricScores: string;
}

const SubmitSuccessScreen: React.FC<SubmitSuccessProps> = ({
  caseId,
  studentAnswer,
  correctAnswer,
  score,
  evaluationMetricScores,
}) => {
  const router = useRouter();

  const navigateToEvaluation = (view?: string) => {
    console.log(
      "Original evaluationMetricScores in SubmitSuccess:",
      evaluationMetricScores
    );

    // This temporary placeholder will be replaced by actual data when the backend is updated
    const conversationData = [
      {
        question: "This function is currently unavailable.",
        comment: "This function is currently unavailable.",
      },
    ];

    const queryParams = new URLSearchParams({
      caseId,
      studentAnswer,
      correctAnswer,
      score,
      evaluationMetricScores,
      case: correctAnswer,
      conversationData: JSON.stringify(conversationData),
      ...(view && { view }), // Only add view parameter if it exists
    }).toString();

    console.log(
      "Passing conversation data to evaluation page:",
      JSON.stringify(conversationData)
    );
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
