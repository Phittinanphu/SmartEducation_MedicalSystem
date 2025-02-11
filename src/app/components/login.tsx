import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // สำหรับการนำทาง
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Card from "./card";
import Input from "./input"; // เพิ่มการนำเข้า Input component
import Button from "./button";
import { CardContent } from "./card";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");  // สถานะสำหรับเก็บอีเมล
  const [password, setPassword] = useState(""); // สถานะสำหรับเก็บรหัสผ่าน
  const navigate = useNavigate(); // ใช้สำหรับการนำทาง

  const handleLogin = () => {
    // ตัวอย่างการตรวจสอบอีเมลและรหัสผ่าน
    if (email && password) {
      // ถ้ากรอกอีเมลและรหัสผ่านครบ
      navigate("/home"); // เปลี่ยนไปหน้าหลักหลังจากล็อกอินสำเร็จ
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
              value={email} // ส่งค่า email
              onChange={handleEmailChange} // ใช้ฟังก์ชัน handleEmailChange
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full"
                value={password} // ส่งค่า password
                onChange={handlePasswordChange} // ใช้ฟังก์ชัน handlePasswordChange
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)} // สลับการแสดงรหัสผ่าน
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
            onClick={handleLogin} // เรียกฟังก์ชัน handleLogin เมื่อกดปุ่ม
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
