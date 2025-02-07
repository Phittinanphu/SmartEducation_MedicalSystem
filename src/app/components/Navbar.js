import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <img
          src="/Logo.png" 
          alt="Logo"
          className="h-102 w-102"
        />
        <span className="text-xl font-semibold">Smart Healthcare Asst.</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-10 text-lg ml-auto mr-9">
        <a href="#" className="hover:text-blue-600">Homepage</a>
        <a href="#" className="hover:text-blue-600">Profile</a>
        <a href="#" className="hover:text-blue-600">Contact</a>
      </div>

      {/* Login Button */}
      <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
        Login
      </button>
    </nav>
  );
};

export default Navbar;



