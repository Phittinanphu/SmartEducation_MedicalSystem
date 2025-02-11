"use client";
import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <img src="/Logo.png" alt="Logo" className="h-[102px] w-[102px]" />
        <span className="text-xl font-semibold">Smart Healthcare Asst.</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-10 text-lg ml-auto mr-9">
        <a href="#" className="hover:text-blue-600">
          Homepage
        </a>
       
        <a href="#" className="hover:text-blue-600">
          Contact
        </a>
      </div>

      {/* Profile Icon */}
      <Link href="/profile">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600">
          <span className="text-white text-lg">P</span>
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
