"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { encodeString } from '@/utils/auth';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
}

interface Errors {
  firstName?: string;
  username?: string;
  password?: string;
}

export default function SignUpComponent() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: 'user', // Default role
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isUserAlreadyExist, setIsUserAlreadyExist] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const encodedPassword = encodeString(formData.password);
      const payload = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        username: formData.username,
        password: encodedPassword,
        role: formData.role,
      };

      try {
        const response = await axios.post(`${process.env.BASE_URL}/api/auth/register`, payload, {
          withCredentials: true,
        });
        if (response?.data?.data === -1) {
          setIsUserAlreadyExist(true);
        } else if (response?.data?.data === 1) {
          router.push('/');
        }
      } catch (error) {
        console.error('handleSubmit Error:', error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role *</label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2 text-gray-700">User</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Admin</span>
            </label>
          </div>
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Sign Up
        </button>

        {isUserAlreadyExist && (
          <div className="mt-2 text-center text-red-500 text-sm">
            Username Already Exists
          </div>
        )}

        <Link href="/login" className="mt-4 text-center block text-blue-600 hover:underline">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
