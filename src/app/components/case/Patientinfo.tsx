import React, { useEffect, useState } from "react";

const PatientInfo: React.FC = () => {
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
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchData();
  }, []);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  const { Patient_Info, Visit_Info, Vital_Signs, Lifestyle } = patientData;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Patient Portfolio</h2>
      <div className="mb-4">
        <h3 className="font-semibold text-blue-500">Patient Information</h3>
        <p>
          <strong>Name:</strong> {Patient_Info?.Name}
        </p>
        <p>
          <strong>HN:</strong> {Patient_Info?.HN}
        </p>
        <p>
          <strong>Age:</strong> {Patient_Info?.Age}
        </p>
        <p>
          <strong>Sex:</strong> {Patient_Info?.Sex}
        </p>
        <p>
          <strong>Blood Type:</strong> {Patient_Info?.Blood_Type}
        </p>
        <p>
          <strong>National ID:</strong> {Patient_Info?.National_ID}
        </p>
        <p>
          <strong>Birthdate:</strong> {Patient_Info?.Birthdate}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-blue-500">Visit Information</h3>
        <p>
          <strong>Date of Treatment:</strong> {Visit_Info?.Date_of_Treatment}
        </p>
        <p>
          <strong>Doctor:</strong> {Visit_Info?.Doctor}
        </p>
        <p>
          <strong>Chief Complaint:</strong>
          <br /> {Visit_Info?.Chief_Complaint}
        </p>
        <p>
          <strong>Medical Condition:</strong>
          <br /> {Visit_Info?.Medical_Condition}
        </p>
        <p>
          <strong>Drug Allergy:</strong> {Visit_Info?.Drug_Allergy}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-blue-500">Vital Signs</h3>
        <p>
          <strong>Weight:</strong> {Vital_Signs?.Weight_kg} kg
        </p>
        <p>
          <strong>Height:</strong> {Vital_Signs?.Height_cm} cm
        </p>
        <p>
          <strong>BMI:</strong> {Vital_Signs?.BMI}
        </p>
        <p>
          <strong>BP:</strong> {Vital_Signs?.BP?.Systolic}/
          {Vital_Signs?.BP?.Diastolic}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-blue-500">Lifestyle</h3>
        <p>
          <strong>Drink:</strong> {Lifestyle?.Drink}
        </p>
        <p>
          <strong>Smoke:</strong> {Lifestyle?.Smoke}
        </p>
      </div>
    </div>
  );
};

export default PatientInfo;
