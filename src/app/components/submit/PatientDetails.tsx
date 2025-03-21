import React from "react";

interface PatientDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
  active: boolean;
  patientData: {
    Age: string;
    Name: string;
    Occupation: string;
    Reason: string;
    Sex: string;
    Symptoms: string;
  };
  caseId: string;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  onNext,
  onPrevious,
  active,
  patientData,
  caseId,
}) => {
  if (!patientData) {
    return <div>Loading...</div>;
  }

  const { Age, Name, Occupation, Sex } = patientData;

  return (
    <div
      className="bg-green-300 p-6 rounded-2xl shadow-lg mb-6"
      style={{ width: "883px", height: "265px" }} // Exact width & height from Figma
    >
      <h2 className="font-bold text-lg">Patient Details Section</h2>
      <div className="flex items-center mb-2">
        <span className="mr-2">📌</span>
        <p className="font-semibold">Basic Patient Information</p>
      </div>
      <ul className="list-disc pl-5 text-lg">
        <li>
          <strong>Patient Name:</strong> {Name}
        </li>
        <li>
          <strong>Age:</strong> {Age}
        </li>
        <li>
          <strong>Sex:</strong> {Sex}
        </li>
        <li>
          <strong>Occupation:</strong> {Occupation}
        </li>
      </ul>
      {active && (
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
      )}
    </div>
  );
};

export default PatientDetails;
