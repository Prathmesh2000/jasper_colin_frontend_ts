"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { encodeString } from "@/utils/auth";

interface LoginFormData {
  username: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

export default function LoginComponent() {
  const [formData, setFormData] = useState<LoginFormData>({ username: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/auth/login`, {
        username: formData.username,
        password: encodeString(formData.password),
      }, { withCredentials: true });

      if (response?.data?.data === "Login successful") {
        router.push("/");
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">Login</h1>

        <div className="mb-4">
          <label className="block font-medium mb-1">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        {loginError && <p className="text-red-500 text-sm mt-3 text-center">Invalid username or password</p>}

        <p className="text-center mt-4 text-blue-600 hover:underline">
          <Link href="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
