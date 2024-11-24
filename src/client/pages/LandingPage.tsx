import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Thank you for evaluating the assignment.
      </h1>
      <div className="flex flex-col items-center text-lg mb-6 w-full">
        <span>As part of this assignment, I have used</span>
        <div className="flex md:flex-row flex-col w-1/2">
          <div className="w-1/2 p-2 flex flex-col items-center">
            <h2 className="border-b border-amber-50 w-full text-center mb-4">
              Backend
            </h2>
            <ul>
              <li className="mb-2 text-xs">NestJs</li>
              <li className="mb-2 text-xs">MongoDB</li>
              <li className="mb-2 text-xs">Pino for logging</li>
            </ul>
          </div>
          <div className="w-1/2 p-2 flex flex-col items-center">
            <h2 className="border-b border-amber-50 w-full text-center mb-4">
              Frontend
            </h2>
            <ul>
              <li className="mb-2 text-xs">ReactJs</li>
              <li className="mb-2 text-xs">Webpack for build</li>
              <li className="mb-2 text-xs">Tailwind (experimented) for css</li>
              <li className="mb-2 text-xs">Zustand for state management</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-lg mb-6">
        You could test the Signup / Login flow below
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-100"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-500"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
