import React, { useEffect, useState } from "react";

interface PatientDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
  active: boolean;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  onNext,
  onPrevious,
  active,
}) => {
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/endpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request: "patient_info" }),
        });
        const data = await response.json();
        setPatientData(data.Patient_Info);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
  }, []);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="bg-green-300 p-6 rounded-2xl shadow-lg mb-6"
      style={{ width: "883px", height: "240px" }} // Exact width & height from Figma
    >
      <h2 className="font-bold text-lg">Patient Details Section</h2>
      <div className="flex items-center mb-2">
        <span className="mr-2">📌</span>
        <p className="font-semibold">Basic Patient Information</p>
      </div>
      <ul className="list-disc pl-5 text-lg">
        <li>
          <strong>Patient Name:</strong> {patientData.Name}
        </li>
        <li>
          <strong>Age:</strong> {patientData.Age}
        </li>
        <li>
          <strong>Sex:</strong> {patientData.Sex}
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
