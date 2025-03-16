import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
// import loginpic from "../public/loginpic.png";
import Link from "next/link";
const loginpic = "/loginpic.png";
const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-otp", {
        otp,
      });
      console.log(response.data);
      // Handle successful verification
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100 p-4">
      <div className="hidden md:flex md:justify-center md:items-center md:w-auto lg:w-auto md:mr-8">
        <Image
          src={loginpic}
          alt="OTP Verification"
          className="rounded-lg"
          style={{ maxWidth: "500px" }}
        />
      </div>
      <div className="w-full md:w-2/3 lg:w-1/3 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
        <p className="mb-6">Enter the OTP sent to your email</p>
        <form onSubmit={handleOTPVerification}>
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify OTP
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

export default VerifyOtp;
