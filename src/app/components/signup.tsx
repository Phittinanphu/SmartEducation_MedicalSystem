"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Card from "./card";
import Input from "./input";
import Button from "./button";
import { CardContent } from "./card";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name : "",
    studentId: "",
    university: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Changed field:", name, "New Value:", value); // Debugging
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = () => {
    if (!formData.name || !formData.studentId || !formData.university || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    router.push("/dashboard");
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
          <p className="text-gray-600">Sign up</p>

          <div className="mt-6 space-y-4">
            <Input type="text" name="name" placeholder="Name - Surname" className="w-full" value={formData.name} onChange={handleChange} />
            <Input type="text" name="studentId" placeholder="Student ID" className="w-full" value={formData.studentId} onChange={handleChange} />
            <Input type="text" name="university" placeholder="University" className="w-full" value={formData.university} onChange={handleChange} />
            <Input type="email" name="email" placeholder="Email" className="w-full" value={formData.email} onChange={handleChange} />
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full" value={formData.password} onChange={handleChange} />
              <button type="button" className="absolute right-3 top-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className="w-full" value={formData.confirmPassword} onChange={handleChange} />
              <button type="button" className="absolute right-3 top-3 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleSignup}>
            Register
          </Button>

          <div className="my-4 text-gray-500">or continue with</div>

          <Button className="flex w-full items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
            <FaGoogle className="mr-2" /> Google
          </Button>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/login")}>
              Sign in
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
