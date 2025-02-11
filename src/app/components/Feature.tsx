import React from "react";

const FeatureSection: React.FC = () => {
  return (
    <section className="py-12 text-center">
      <h2 className="text-4xl font-bold mb-10">Feature</h2>
      <div className="flex flex-col md:flex-row justify-center gap-12 px-6">
        {/* Case Studies Card */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <img src="/case-studies.png" alt="Case Studies" className="w-full rounded-md" />
          <p className="mt-4 text-xl font-semibold text-gray-800">Case Studies</p>
        </div>

        {/* Chat History Card */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <img src="/chat-history.png" alt="Chat History" className="w-full rounded-md" />
          <p className="mt-4 text-xl font-semibold text-gray-800">Chat History</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

