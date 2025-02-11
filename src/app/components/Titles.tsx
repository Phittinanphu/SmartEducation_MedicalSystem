import React from "react";

const TitleSection: React.FC = () => {
  return (
    <section className="bg-blue-100 py-12 text-center px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <img
          src="/Logo2.png"
          alt="Logo"
          className="w-[534px] h-[513px] md:w-[534px] md:h-[513px] mb-6 md:mb-0"
        />
        <div className="md:ml-10 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900">Smart Healthcare Asst.</h1>
          <h2 className="text-3xl text-gray-700 mt-5">Learn & Practice Medicine</h2>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto md:mx-0">
            <p className="text-gray-600 text-lg">
              Every conversation with a patient is a lesson, and every question asked is a step
              toward becoming a better doctor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TitleSection;
