// ChatInterface.tsx
import React from "react";

type ChatInterfaceProps = {
  patientName?: string;
  patientMessage: string;
  options: string[];
  onOptionSelect: (option: string) => void;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  patientName = "Johnson William",
  patientMessage,
  options,
  onOptionSelect,
}) => {
  return (
    <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-6 w-[40%] h-[69%] flex flex-col justify-between">
      {/* Patient's Message */}
      <div className="bg-gray-100 p-4 rounded-lg text-black">
        <p className="font-bold text-blue-600">{patientName}</p>
        <p>{patientMessage}</p>
      </div>
      
      {/* Options for the Medical Student at the Bottom */}
      <div className="flex flex-col gap-2 mt-auto">
        {options.map((option, index) => (
          <button
            key={index}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            onClick={() => onOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;