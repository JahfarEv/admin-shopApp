import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerManager, clearRegistrationError } from "../store/manager/managerRegistrationSlice";

const ManagerRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, status, error } = useSelector((state) => state.managerRegistration);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    ifscCode: "",
    bankAccountNumber: "",
    bankName: "",
    password: "",
    pancardNumber: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setSuccessMessage("Registration successful! Awaiting admin approval.");
      setTimeout(() => {
        navigate("/manager/dashboard");
      }, 2000);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      setErrors({ submit: error });
      dispatch(clearRegistrationError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Valid 10-digit mobile number required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.ifscCode || !/^[A-Za-z]{4}\d{7}$/.test(formData.ifscCode))
      newErrors.ifscCode = "Valid IFSC code required";
    if (
      !formData.bankAccountNumber ||
      !/^\d{9,18}$/.test(formData.bankAccountNumber)
    )
      newErrors.bankAccountNumber = "Valid account number required";
    if (!formData.bankName) newErrors.bankName = "Bank name required";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (
      !formData.pancardNumber ||
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pancardNumber)
    ) {
      newErrors.pancardNumber = "Valid PAN card number required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...dataToSend } = formData;
    dispatch(registerManager(dataToSend));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side - Illustration */}
            <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-indigo-600 to-blue-500 p-8 text-white">
              <div className="flex flex-col h-full justify-center">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <p className="mb-8">Join our team as a manager and start managing your operations efficiently.</p>
                <div className="mt-auto">
                  <svg
                    className="w-full h-48"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
                      fill="white"
                      fillOpacity="0.1"
                    />
                    <path
                      d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
                      fill="white"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M70 120C70 131.046 78.9543 140 90 140H110C121.046 140 130 131.046 130 120V110C130 98.9543 121.046 90 110 90H90C78.9543 90 70 98.9543 70 110V120Z"
                      fill="white"
                    />
                    <path
                      d="M90 100C92.7614 100 95 97.7614 95 95C95 92.2386 92.7614 90 90 90C87.2386 90 85 92.2386 85 95C85 97.7614 87.2386 100 90 100Z"
                      fill="#3B82F6"
                    />
                    <path
                      d="M110 100C112.761 100 115 97.7614 115 95C115 92.2386 112.761 90 110 90C107.239 90 105 92.2386 105 95C105 97.7614 107.239 100 110 100Z"
                      fill="#3B82F6"
                    />
                    <path
                      d="M85 115C85 112.239 87.2386 110 90 110H110C112.761 110 115 112.239 115 115C115 117.761 112.761 120 110 120H90C87.2386 120 85 117.761 85 115Z"
                      fill="#3B82F6"
                    />
                    <path
                      d="M100 60C106.627 60 112 65.3726 112 72V80C112 86.6274 106.627 92 100 92C93.3726 92 88 86.6274 88 80V72C88 65.3726 93.3726 60 100 60Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-2/3 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Manager Registration
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Fill in your details to create an account
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                  {successMessage}
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.mobileNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.bankName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.bankName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bankName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bankAccountNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.bankAccountNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.bankAccountNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bankAccountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="ifscCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="ABCD0123456"
                      className={`mt-1 block w-full px-3 py-2 border ${errors.ifscCode ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.ifscCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="pancardNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PAN Card Number
                  </label>
                  <input
                    type="text"
                    id="pancardNumber"
                    name="pancardNumber"
                    value={formData.pancardNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.pancardNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.pancardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pancardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/admin/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerRegistration;