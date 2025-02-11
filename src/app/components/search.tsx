"use client";  // Ensure this is at the top of the file
import React from "react";
import { useRouter } from "next/navigation";  // Use "next/navigation" in App Router
import { Search } from "lucide-react";

const SearchSection: React.FC = () => {
  const router = useRouter();

  // Navigation handler
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-blue-100 w-full py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <img src="/Logo2.png" alt="Healthcare Logo" className="w-[534px] h-[513px]" />
        </div>

        {/* Right Section: Search and Features */}
        <div className="flex flex-col flex-grow pl-6">
          <h1 className="text-5xl font-bold">Smart Healthcare Asst.</h1>
          <p className="text-3xl text-gray-700 mt-5">Learn & Practice Medicine</p>

          {/* Search Bar */}
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

          {/* Features Section (Clickable Icons) */}
          <div className="flex justify-center gap-16 mt-6">
            {[
              { label: "Case Studies", icon: "✔️", path: "/studycase" },
              { label: "Quiz", icon: "❓", path: "/quiz" },
              { label: "Research", icon: "📖", path: "/research" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleNavigation(item.path)}
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl hover:bg-gray-400 transition">
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

export default SearchSection;






