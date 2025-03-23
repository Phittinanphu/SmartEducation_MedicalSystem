import React, { useState } from "react";
import Patient2D from "./Patient2D";
import Image from "next/image";

const FeatureSection: React.FC = () => {
  const [mood, setMood] = useState<
    "normal" | "happy" | "sad" | "angry" | "scared"
  >("normal");

  return (
    <section className="py-12 text-center">
      <h2 className="text-4xl font-bold mb-10">Feature</h2>
      <div className="flex flex-col md:flex-row justify-center gap-12 px-6">
        {/* Case Studies Card */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <Image
            src="/case-studies.png"
            alt="Case Studies"
            width={400}
            height={300}
            className="w-full rounded-md"
          />
          <p className="mt-4 text-xl font-semibold text-gray-800">
            Case Studies
          </p>
        </div>

        {/* Chat History Card */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <Image
            src="/chat-history.png"
            alt="Chat History"
            width={400}
            height={300}
            className="w-full rounded-md"
          />
          <p className="mt-4 text-xl font-semibold text-gray-800">
            Chat History
          </p>
        </div>
      </div>

      {/* Patient Model */}
      <div className="mt-12 flex flex-col items-center">
        <Patient2D mood={mood} />
        <button
          onClick={() => setMood("happy")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Speak
        </button>
      </div>
    </section>
  );
};

export default FeatureSection;
