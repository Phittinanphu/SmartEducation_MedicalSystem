"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PatientHistoryItem {
  name: string;
  symptoms: string;
  date: string;
}

const historyData: PatientHistoryItem[] = [
  { name: "James Carter", symptoms: "Persistent cough, fever, and shortness of breath", date: "March 1, 2025" },
  { name: "Emily Watson", symptoms: "Severe headache, nausea, and blurred vision", date: "March 3, 2025" },
];

const PatientHistory: React.FC = () => {
  const router = useRouter();

  const handleViewAnswer = () => {
    router.push("/evaluation_page");
  };

  // ✅ ฟังก์ชันใหม่สำหรับปุ่ม Report
  const handleViewReport = (patientName: string) => {
    router.push(`/report?patient=${encodeURIComponent(patientName)}`);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Patient Chat History</h2>
      {historyData.map((caseItem, index) => (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">□</span>
            </div>
            <div>
              <p className="text-lg font-semibold">
                <span className="font-bold">Patient Name:</span> {caseItem.name}
              </p>
              <p className="text-sm">
                <span className="font-bold">Symptoms:</span> {caseItem.symptoms}
              </p>
              <p className="text-xs text-gray-500">Chat Date: {caseItem.date}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleViewAnswer} className="text-blue-600 hover:underline">
              View Answer
            </button>
            {/* ✅ กดปุ่ม Report แล้วไปที่หน้ารายงาน */}
            <button onClick={() => handleViewReport(caseItem.name)} className="text-red-600 hover:underline">
              Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientHistory;
