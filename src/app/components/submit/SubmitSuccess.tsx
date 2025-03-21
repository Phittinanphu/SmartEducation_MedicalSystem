"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SubmitSuccessProps {
  caseId: string;
  studentAnswer: string;
  correctAnswer: string;
}

const SubmitSuccessScreen: React.FC<SubmitSuccessProps> = ({
  caseId,
  studentAnswer,
  correctAnswer,
}) => {
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState(correctAnswer);
  const BE_IP = process.env.NEXT_PUBLIC_BE_IP;

  useEffect(() => {
    const sendCompletion = async () => {
      try {
        const response = await fetch(`${BE_IP}/chat/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            case_id: caseId,
            answer: studentAnswer,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
          return;
        }

        const data = await response.json();
        console.log("Completion response:", data);
        setDiagnosis(data.diagnosis); // Update diagnosis with the value from the response
      } catch (error) {
        console.error("Error sending completion request:", error);
      }
    };

    sendCompletion();
  }, [caseId, studentAnswer]);

  const HandleViewAnswer = async () => {
    try {
      const response = await fetch(`${BE_IP}/chat/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          case_id: caseId,
          answer: studentAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Completion response:", data);

      const queryParams = new URLSearchParams({
        caseId: caseId,
        studentAnswer: studentAnswer,
        correctAnswer: data.disease,
        score: data.score,
        evaluationMetricScores: JSON.stringify(data.evaluationMetricScores),
      }).toString();

      router.push(`/evaluation_page?${queryParams}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const HandleBackToHome = () => {
    router.push("/main");
  };

  const HandleViewConversation = async () => {
    try {
      const response = await fetch(`${BE_IP}/chat/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          case_id: caseId,
          answer: studentAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Completion response:", data);

      const queryParams = new URLSearchParams({
        caseId: caseId,
        studentAnswer: studentAnswer,
        correctAnswer: data.disease,
        view: "conversation",
        score: data.score,
        evaluationMetricScores: JSON.stringify(data.evaluationMetricScores),
      }).toString();

      router.push(`/evaluation_page?${queryParams}`);
    } catch (error) {
      console.error("Error:", error);
    }
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
            onClick={HandleBackToHome}
            className="w-227 h-50 mt-6 bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Back To Home
          </button>
          <button
            onClick={HandleViewConversation}
            className="w-227 h-50 mt-6 bg-purple-400 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            View Conversation
          </button>
          <button
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
