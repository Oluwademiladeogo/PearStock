import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const loginpic = "/loginpic.png"; // Path for login illustration image

// Define validation schema for login form
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  rememberMe: Yup.boolean(),
});

const Login: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100 p-4">
      {/* Left side image for larger screens */}
      <div className="hidden md:flex md:justify-center md:items-center md:w-auto lg:w-auto md:mr-8">
        <Image
          src={loginpic}
          alt="Login"
          width={600}
          height={400}
          className="rounded-lg max-w-full md:max-w-md lg:max-w-lg"
        />
      </div>
      {/* Login Form */}
      <div className="w-full md:w-2/3 lg:w-1/3 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          Welcome{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h1>
        <p className="mb-6">Please login here</p>
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}
        {/* Formik handles form state and validation */}
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/login/`,
                {
                  email: values.email,
                  password: values.password,
                }
              );
              const { token, user } = response.data;
              // Store authentication data in cookies
              Cookies.set("token", token, { expires: 7 });
              Cookies.set("user", JSON.stringify(user), { expires: 7 });
              router.push("/dashboard");
            } catch (error: any) {
              setServerError(
                error.response?.data?.error || "Invalid credentials"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.email && touched.email && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.email}
                  </div>
                )}
              </div>
              {/* Password Field */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.password && touched.password && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.password}
                  </div>
                )}
              </div>
              {/* Remember Me Checkbox */}
              <div className="flex items-center mb-4">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember Me
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        {/* Link to Signup Page */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
