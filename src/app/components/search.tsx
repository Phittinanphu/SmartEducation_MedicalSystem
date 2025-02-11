import React from "react";
import { Search } from "lucide-react";

const TitleSection = () => {
  return (
    <div className="bg-blue-100 w-full py-6">
      {/* Container for layout */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <img
            src="Logo2.png"
            alt="Healthcare Logo"
            className="w-[534px] h-[513px]"
          />
        </div>

        {/* Right Section: Search and Features */}
        <div className="flex flex-col flex-grow pl-6">
          {/* Title */}
          <h1 className="text-5xl font-bold">Smart Healthcare Asst.</h1>
          <p className="text-3xl text-gray-700 mt-5">Learn & Practice Medicine</p>

          {/* Search Bar (Same width as title) */}
          <div className="relative mt-4 w-[520px] max-w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none shadow-sm text-lg"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full p-3">
              <Search size={22} />
            </button>
          </div>

          {/* Features Section (Centered Icons) */}
          <div className="flex justify-center gap-16 mt-6">
            {[  
              { label: "Case Studies", icon: "✔️" },
              { label: "Quiz", icon: "❓" },
              { label: "Research", icon: "📖" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <p className="text-gray-700 mt-2 text-lg">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;




