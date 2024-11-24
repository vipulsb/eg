import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const { registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [validation, setValidation] = useState({
    minLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    userConflict: "",
  });

  const areInputFieldsInvalid = () => {
    let isFormInValid = false;
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isFormInValid ||= true;
    }
    if (!formData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password requirements not met",
      }));
      isFormInValid ||= true;
    }
    if (!Object.keys(validation).every((key) => validation[key])) {
      isFormInValid ||= true;
      setErrors((prev) => ({
        ...prev,
        password: "Password requirements not met",
      }));
    }
    return isFormInValid;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    setErrors((prev) => ({ ...prev, name: "", userConflict: "" }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({ ...prev, email: "", userConflict: "" }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    setValidation({
      minLength: value.length >= 8,
      hasLetter: /[A-Za-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[@$!%*?&]/.test(value),
    });
    setErrors((prev) => ({ ...prev, password: "", userConflict: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (areInputFieldsInvalid()) {
      return;
    }
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err: any) {
      if (err.status === 409) {
        setErrors((prev) => ({
          ...prev,
          userConflict: `User with ${formData.email} already exists. Please login instead`,
        }));
      }
    }
  };

  const modalBody = (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleEmailChange}
          onFocus={() => setErrors((prev) => ({ ...prev, name: "" }))}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-300" : ""
          }`}
          type="email"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          name="password"
          value={formData.password}
          onChange={handlePasswordChange}
          onFocus={() => setErrors((prev) => ({ ...prev, email: "" }))}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? "border-red-300" : ""
          }`}
          type="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          className={
            "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
          type="text"
          placeholder="Enter your name"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white py-2 rounded-md hover:bg-green-600 bg-green-500 text-white px-4 py-2 rounded"
      >
        Signup
      </button>
      <p className="mt-4 text-center text-gray-500">
        Already registered?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
  return (
    <div className="w-full px-4 h-full min-h-screen">
      <div className="flex flex-col md:flex-row ">
        <div className="w-full md:w-1/4 border border-amber-50 flex justify-center items-center">
          <div className="mb-6">
            <div className="mb-6 text-gray-800">Password requirements</div>
            <ul className="list-disc pl-5">
              <li
                className={`${
                  validation.minLength ? "text-green-500" : "text-gray-500"
                }`}
              >
                Minimum length of 8 characters
              </li>
              <li
                className={`${
                  validation.hasLetter ? "text-green-500" : "text-gray-500"
                }`}
              >
                Contains at least 1 letter
              </li>
              <li
                className={`${
                  validation.hasNumber ? "text-green-500" : "text-gray-500"
                }`}
              >
                Contains at least 1 number
              </li>
              <li
                className={`${
                  validation.hasSpecialChar ? "text-green-500" : "text-gray-500"
                }`}
              >
                Contains at least 1 special character (@$!%*?&)
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <Modal
            title="Signup"
            body={modalBody}
            errorMessage={errors.userConflict}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
