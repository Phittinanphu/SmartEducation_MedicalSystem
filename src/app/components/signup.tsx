import React from "react";
import  Button  from "./button";
import Input from "./input";
import  Card  from "./card";
import { FaGoogle } from "react-icons/fa";
import { CardContent } from "./card";

const SignupPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-100">
      <div className="flex w-3/4 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side: Logo */}
        <div className="flex flex-col items-center justify-center w-1/2 bg-white p-10">
          <img src="/logo.png" alt="Logo" className="w-32 h-32" />
          <h1 className="text-2xl font-bold mt-4">Smart Healthcare Asst.</h1>
        </div>
        {/* Right Side: Form */}
        <div className="w-1/2 bg-blue-50 p-10 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">Sign up</h2>
          <Card className="w-full max-w-sm p-4">
            <CardContent>
            <Input type="text" placeholder="Name - Surname" className="mb-3" value="" onChange={() => {}} />
            <Input type="text" placeholder="Student ID" className="mb-3" value="" onChange={() => {}} />
            <Input type="text" placeholder="University" className="mb-3" value="" onChange={() => {}} />
            <Input type="email" placeholder="Email" className="mb-3" value="" onChange={() => {}} />
            <Input type="password" placeholder="Password" className="mb-3" value="" onChange={() => {}} />
            <Input type="password" placeholder="Confirm-Password" className="mb-3" value="" onChange={() => {}} />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
            </CardContent>
          </Card>
          <p className="mt-4 text-gray-500">or continue with</p>
          <Button className="mt-2 flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg">
            <FaGoogle className="text-red-500" /> Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
