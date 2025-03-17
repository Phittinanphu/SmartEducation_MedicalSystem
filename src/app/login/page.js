"use client";
import React from "react";
import LoginPage from "../components/login"; // Import the LoginPage component
import Navbar from "../components/Navbar";

const LoginPageContainer = () => {
  return (
    <>
      <Navbar />
      <LoginPage />
    </>
  );
};

export default LoginPageContainer;



