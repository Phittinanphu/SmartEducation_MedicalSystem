import React from "react";

const SubmitInstructions: React.FC = () => {
  return (
    <div className="bg-green-300 p-6 rounded-2xl shadow-lg w-2/3 md:w-1/2">
      <h2 className="font-bold text-lg mb-2">Submit Chat History</h2>
      <p className="font-semibold">Instruction</p>
      <ul className="list-disc pl-5 text-sm">
        <li>“Please review your conversation with the patient before submission.”</li>
        <li>“Ensure all necessary details are included, and edit if needed.”</li>
        <li>“Once submitted, you will not be able to make changes.”</li>
      </ul>
      <div className="flex justify-between mt-4">
        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg">Previous</button>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg">Next</button>
      </div>
    </div>
  );
};

export default SubmitInstructions;
