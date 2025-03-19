import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
const loginpic = "/loginpic.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle forgot password form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call API to request password reset
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password/`,
        {
          email,
        },
      );
      setMessage("Reset instructions have been sent to your email.");
    } catch (error) {
      setMessage("Error sending reset instructions.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100 p-4">
      <div className="hidden md:flex md:justify-center md:items-center md:w-auto lg:w-auto md:mr-8">
        <Image
          src={loginpic}
          alt="Forgot Password"
          className="rounded-lg"
          style={{ maxWidth: "500px" }}
        />
      </div>
      <div className="w-full md:w-2/3 lg:w-1/3 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="mb-6">Enter your email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Password
          </button>
        </form>
        <Link
          href="/login"
          className="block text-right mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
