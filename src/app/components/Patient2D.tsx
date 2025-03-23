import React from "react";
import Image from "next/image";

type Patient2DProps = {
  mood: "normal" | "happy" | "sad" | "angry" | "scared";
};

const Patient2D: React.FC<Patient2DProps> = ({ mood }) => {
  // เลือกรูปภาพตามอารมณ์
  const moodImages: Record<string, string> = {
    normal: "/patient/normal.png",
    happy: "/patient/happy.png",
    sad: "/patient/sad.png",
    angry: "/patient/angry.png",
    scared: "/patient/scared.png",
  };

  return (
    <div className="flex justify-center items-center w-full h-auto">
      <Image
        src={moodImages[mood] || moodImages["normal"]}
        alt={`Patient ${mood}`}
        width={200}
        height={200}
        className="w-full max-w-[200px] h-auto object-contain transition-opacity duration-300"
      />
    </div>
  );
};

export default Patient2D;
