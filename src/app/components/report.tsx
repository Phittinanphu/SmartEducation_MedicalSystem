"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Navbar from "../components/Navbar2"; // ✅ Import Navbar

const Report = ({ patientName }: { patientName: string }) => {
  const router = useRouter(); // Initialize router
  const pdfFileName = `/reports/${patientName
    .toLowerCase()
    .replace(/ /g, "-")}-report.pdf`;

  const handleButtonClick = () => {
    router.push("/evaluation_page"); // Router push to /evaluation_page
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {" "}
      {/* Change background color to blue-100 */}
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-6">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center">
            {patientName}'s Report
          </h2>
          <p className="text-center text-green-600 font-semibold mt-2">
            ✅ The correct answer
          </p>

          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
              onClick={handleButtonClick} // Add onClick handler
            >
              Evaluation Score
            </button>
          </div>

          <h3 className="text-lg font-semibold mt-6 text-center underline">
            Formal Report
          </h3>

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

          {/* ✅ แสดง PDF ในหน้า */}
          <div className="mt-6 border p-4 rounded-md bg-gray-50">
            <h3 className="text-xl font-semibold">{patientName}'s Diagnosis</h3>
            <iframe
              src={pdfFileName}
              width="100%"
              height="500px"
              className="rounded-md border"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
