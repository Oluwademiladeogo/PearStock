import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
const loginpic = "";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]{2,30}$/, "Name must contain only letters and spaces")
    .required("Name is required"),
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Signup: React.FC = () => {
  const [serverError, setServerError] = useState("");

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-gray-100 p-4">
      <div className="hidden md:flex md:justify-center md:items-center md:w-auto lg:w-auto md:mr-8">
        <Image
          src={loginpic}
          alt="Signup"
          className="rounded-lg"
          style={{ maxWidth: "500px" }}
        />
      </div>
      <div className="w-full md:w-2/3 lg:w-1/3 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <p className="mb-6">Please fill in your details</p>
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/signup/`,
                {
                  name: values.name,
                  email: values.email,
                  password: values.password,
                }
              );
              console.log(response.data);
              // Handle successful signup
            } catch (error: any) {
              setServerError(
                error.response?.data?.error || "An error occurred during signup"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.name && touched.name && (
                  <div className="mt-1 text-xs text-red-500">{errors.name}</div>
                )}
              </div>

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

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
