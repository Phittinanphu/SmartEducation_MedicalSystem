"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name || !studentId || !university || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Sign-up successful! Redirecting to login...");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Smart Healthcare Logo"
            className="w-24 h-24"
          />
          <h2 className="text-xl font-bold mt-4">Smart Healthcare Asst.</h2>
        </div>

        <h3 className="text-lg font-semibold mt-6 text-center">Sign up</h3>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name - Surname"
            className="w-full px-4 py-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Student ID"
            className="w-full px-4 py-2 border rounded-md"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <input
            type="text"
            placeholder="University"
            className="w-full px-4 py-2 border rounded-md"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">or continue with</div>

        <div className="flex justify-center">
          <button className="border rounded-full p-2 hover:bg-gray-100">
            <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
          </button>
        </div>

        {/* Redirect to Login */}
        <div className="text-center mt-4">
          <span className="text-gray-500">Already have an account? </span>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
