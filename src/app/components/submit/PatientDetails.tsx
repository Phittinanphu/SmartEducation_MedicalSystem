import React from "react";

interface PatientDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ onNext, onPrevious }) => {
  return (
    <div
      className="bg-green-300 p-6 rounded-2xl shadow-lg mb-6"
      style={{ width: "883px", height: "259px" }} // Exact width & height from Figma
    >
      <h2 className="font-bold text-lg">Patient Details Section</h2>
      <div className="flex items-center mb-2">
        <span className="mr-2">📌</span>
        <p className="font-semibold">Basic Patient Information</p>
      </div>
      <ul className="list-disc pl-5 text-sm">
        <li>Patient Name: (Auto-filled based on system records)</li>
        <li>Age: (Auto-filled)</li>
        <li>Primary Symptoms: (Auto-filled, but editable)</li>
        <li>Diagnosis (if applicable): (Auto-filled or left blank for student input)</li>
        <li>Medications Prescribed: (Editable)</li>
      </ul>
      <div className="flex justify-between mt-4">
        <button 
          className="bg-gray-800 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-gray-900 hover:scale-105"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button 
          className="bg-red-600 text-white px-6 py-2 rounded-lg transition-transform transform hover:bg-red-700 hover:scale-105"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;





