"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation hook
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import Card from "./card";
import Input from "./input"; // Import your custom Input component
import Button from "./button";
import { CardContent } from "./card";
// Import for Google Auth
import { signIn } from "next-auth/react";

interface FormEvent extends React.FormEvent<HTMLFormElement> {
  preventDefault: () => void;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");    // For storing email input
  const [password, setPassword] = useState(""); // For storing password input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Next.js router for navigation

  /**
   * Handles Google Sign-In authentication using NextAuth.js
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn('google', { 
        callbackUrl: '/main',
        redirect: false 
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      router.push('/main');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('An error occurred with Google sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      router.push('/main');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to login. Please try again.');
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
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

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {error && (
              <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right text-sm text-blue-500 cursor-pointer">
              Forgot Password?
            </div>
          
            <Button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-4 text-gray-500">or continue with</div>

          <Button 
            className="flex w-full items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2" /> {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>

          <p className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account yet?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => router.push("/signup")}
              style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
            >
              Sign up
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
