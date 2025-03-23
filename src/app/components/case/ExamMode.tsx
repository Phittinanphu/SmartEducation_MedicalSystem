import React from "react";

type ExamData = {
  patientName: string;
  age: string;
  symptoms: string;
  diagnosis: string;
  medications: string;
};

type ExamModeProps = {
  examData: ExamData;
  onExamDataChange: (field: keyof ExamData, value: string) => void;
  onBackToChat: () => void;
  onSubmitExam: () => void;
  showSubmitPopup: boolean;
  setShowSubmitPopup: (value: boolean) => void;
  onConfirmSubmit: () => void; // Provided by page.js to remain on the same page in "chat_page" folder
};

const ExamMode: React.FC<ExamModeProps> = ({
  examData,
  onExamDataChange,
  onSubmitExam,
  showSubmitPopup,
  setShowSubmitPopup,
  onConfirmSubmit,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 mt-4 flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold text-center">Exam Section</h2>
        <label>
          <span className="font-semibold">Patient&apos;s Name:</span>
          <input
            type="text"
            className="border rounded-lg p-2 w-full"
            placeholder="Enter patient's name"
            value={examData.patientName}
            onChange={(e) => onExamDataChange("patientName", e.target.value)}
          />
        </label>
        <label>
          <span className="font-semibold">Age:</span>
          <input
            type="number"
            className="border rounded-lg p-2 w-full"
            placeholder="Enter age"
            value={examData.age}
            onChange={(e) => onExamDataChange("age", e.target.value)}
          />
        </label>
        <label>
          <span className="font-semibold">Primary Symptoms:</span>
          <textarea
            className="border rounded-lg p-2 w-full"
            placeholder="Describe symptoms"
            value={examData.symptoms}
            onChange={(e) => onExamDataChange("symptoms", e.target.value)}
          ></textarea>
        </label>
        <label>
          <span className="font-semibold">Diagnosis (if applicable):</span>
          <input
            type="text"
            className="border rounded-lg p-2 w-full"
            placeholder="Enter diagnosis"
            value={examData.diagnosis}
            onChange={(e) => onExamDataChange("diagnosis", e.target.value)}
          />
        </label>
        <label>
          <span className="font-semibold">Medications Prescribed:</span>
          <input
            type="text"
            className="border rounded-lg p-2 w-full"
            placeholder="Enter medications"
            value={examData.medications}
            onChange={(e) => onExamDataChange("medications", e.target.value)}
          />
        </label>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
          onClick={onSubmitExam}
        >
          Submit
        </button>
      </div>
      {showSubmitPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96 h-40 flex flex-col justify-center">
            <p className="text-lg font-bold">Confirm Answers</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800"
                onClick={() => setShowSubmitPopup(false)}
              >
                NO
              </button>
              <button
                // Clicking YES will call onConfirmSubmit, which is implemented in page.js (within the chat_page folder)
                // to remain on the same page rather than navigating away.
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
                onClick={onConfirmSubmit}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamMode;
