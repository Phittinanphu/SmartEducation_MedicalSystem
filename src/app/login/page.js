"use client";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../components/login"; // Import the LoginPage component
import Navbar from "../components/Navbar";

const Navbarr = () => {
  return (
    <BrowserRouter>
      <nav>

        {/* Directly render the LoginPage component */}
        <Navbar />
        <LoginPage />
      </nav>
    </BrowserRouter>
  );
};

export default Navbarr;



