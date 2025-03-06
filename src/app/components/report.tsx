"use client";
import React from "react";

const Report = ({ patientName }: { patientName: string }) => {
  // ✅ ปรับชื่อไฟล์ให้ตรงกับชื่อจริงที่มี ".pdf.pdf"
  const pdfFileName = `/reports/${patientName.toLowerCase().replace(/ /g, "-")}-report.pdf.pdf`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center">{patientName}'s Report</h2>
        <p className="text-center text-green-600 font-semibold mt-2">✅ The correct answer</p>

        <div className="flex justify-center mt-4">
          <button className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600">
            Analyze your conversation
          </button>
        </div>

        <h3 className="text-lg font-semibold mt-6 text-center underline">Formal Report</h3>

        {/* ✅ ปุ่ม Download PDF */}
        <div className="flex justify-end mt-2">
          <a
            href={pdfFileName}
            download
            className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            <span>Download</span>
            <img src="/file.svg" alt="PDF Icon" className="w-5 h-5" />
          </a>
        </div>

        <div className="mt-6 border p-4 rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold">{patientName}'s Diagnosis</h3>
          <p className="text-gray-700 mt-2">
            This is the medical report for {patientName}. More details on their diagnosis and treatment will be shown here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;
