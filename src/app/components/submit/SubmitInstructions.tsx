import React from "react";

interface SubmitInstructionsProps {
  onNext: () => void;
  onPrevious: () => void;
  active: boolean;
}

const SubmitInstructions: React.FC<SubmitInstructionsProps> = ({
  onNext,
  active,
}) => {
  return (
    <div
      className="bg-green-300 p-6 rounded-2xl shadow-lg mb-6"
      style={{ width: "883px", height: "215px" }}
    >
      <h2 className="font-bold text-lg mb-2 text-blue-700">Submission</h2>
      <p className="font-semibold">Instruction</p>
      <ul className="list-disc pl-5 text-sm">
        <li>
          "Please review your conversation and exam answer before submission."
        </li>
        <li>"Ensure all necessary details are included"</li>
        <li>"Once submitted, you will not be able to make changes."</li>
      </ul>
      {active && (
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-red-700 hover:scale-105"
            onClick={onNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmitInstructions;
