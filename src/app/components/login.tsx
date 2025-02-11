"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation hook
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Card from "./card";
import Input from "./input"; // Import your custom Input component
import Button from "./button";
import { CardContent } from "./card";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");    // For storing email input
  const [password, setPassword] = useState(""); // For storing password input
  const router = useRouter(); // Next.js router for navigation

  const handleLogin = () => {
    // Check if both email and password are provided
    if (email && password) {
      // If both fields are filled, navigate to "/main"
      router.push("/main");
    } else {
      alert("กรุณากรอกข้อมูลให้ครบ");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl">
        <CardContent className="p-8 text-center">
          <img
            src="/logo.png"
            alt="Smart Healthcare Assistant"
            className="mx-auto h-16 w-16"
          />
          <h2 className="mt-4 text-2xl font-bold">Smart Healthcare Asst.</h2>
          <p className="text-gray-600">Login</p>

          <div className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              value={email}
              onChange={handleEmailChange}
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right text-sm text-blue-500 cursor-pointer">
              Forgot Password?
            </div>
          </div>

          <Button
            className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleLogin}
          >
            Sign in
          </Button>

          <div className="my-4 text-gray-500">or continue with</div>

          <Button className="flex w-full items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
            <FaGoogle className="mr-2" /> Google
          </Button>

          <p className="mt-4 text-sm text-gray-600">
            Don't have an account yet?{" "}
            <span className="text-blue-500 cursor-pointer">Sign up</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

