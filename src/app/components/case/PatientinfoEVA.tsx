import React from "react";

interface PatientData {
  Age: string;
  Name: string;
  Occupation: string;
  Reason: string;
  Sex: string;
  Symptoms: string;
}

interface PatientInfoProps {
  patientData: PatientData;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patientData }) => {
  if (!patientData) {
    return <div>Loading...</div>;
  }

  const { Age, Name, Occupation, Reason, Sex, Symptoms } = patientData;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Patient Portfolio</h2>
      <div className="mb-4">
        <h3 className="font-semibold text-blue-500">Patient Information</h3>
        <p>
          <strong>Name:</strong> {Name}
        </p>
        <p>
          <strong>Age:</strong> {Age}
        </p>
        <p>
          <strong>Sex:</strong> {Sex}
        </p>
        <p>
          <strong>Occupation:</strong> {Occupation}
        </p>
        <p>
          <strong>Reason:</strong><br /> {Reason}
        </p>
        <p>
          <strong>Symptoms:</strong><br /> {Symptoms}
        </p>
      </div>
    </div>
  );
};

export default PatientInfo;
