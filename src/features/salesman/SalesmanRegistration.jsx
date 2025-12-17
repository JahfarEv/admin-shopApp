import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  registerSalesman, 
  fetchManagers,
  clearErrors,
  clearSuccessMessage
} from '../store/salesman/registrationSlice';
import AdminLayout from '../../components/layout/AdminLayout';

const SalesmanRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const { 
    managers, 
    loadingManagers, 
    isSubmitting, 
    successMessage, 
    errors: apiErrors,
    managerError 
  } = useSelector((state) => state.salesmanRegister);

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    ifscCode: '',
    bankAccountNumber: '',
    bankName: '',
    pancardNumber: '',
    password: '',
    confirmPassword: '',
    managerId: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Fetch managers on component mount
  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  // Clear success message when component unmounts
  useEffect(() => {
    return () => {
      if (successMessage) {
        dispatch(clearSuccessMessage());
      }
    };
  }, [successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    
    // Clear API error when user starts typing
    if (apiErrors[name] || apiErrors.submit) {
      dispatch(clearErrors());
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) 
      newErrors.mobileNumber = 'Valid 10-digit mobile number required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) 
      newErrors.email = 'Valid email required';
    if (!formData.ifscCode || !/^[A-Za-z]{4}\d{7}$/.test(formData.ifscCode))
      newErrors.ifscCode = 'Valid IFSC code required';
    if (!formData.bankAccountNumber || !/^\d{9,18}$/.test(formData.bankAccountNumber))
      newErrors.bankAccountNumber = 'Valid account number required';
    if (!formData.bankName) newErrors.bankName = 'Bank name required';
    if (!formData.pancardNumber || !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.pancardNumber))
      newErrors.pancardNumber = 'Valid PAN card number required';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.managerId)
      newErrors.managerId = 'Please select a manager';
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...salesmanData } = formData;
      dispatch(registerSalesman(salesmanData))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            navigate('/salesman/dashboard');
          }, 2000);
        })
        .catch((error) => {
          console.error('Registration failed:', error);
        });
    }
  };

  // Combine validation errors and API errors for display
  const errors = { ...validationErrors, ...apiErrors };

  return (
    <AdminLayout>
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-6 px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Salesman Registration</h2>
            <p className="mt-2 text-indigo-100">
              Fill in your details to create an account
            </p>
          </div>

          <div className="p-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {managerError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-700 font-medium">{managerError}</p>
                    <button 
                      onClick={() => dispatch(fetchManagers())}
                      className="mt-1 text-sm text-red-600 hover:text-red-500 font-medium"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{errors.submit}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="pancardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Card Number
                    </label>
                    <input
                      id="pancardNumber"
                      name="pancardNumber"
                      type="text"
                      value={formData.pancardNumber}
                      onChange={handleChange}
                      placeholder="AAAAA1234A"
                      className={`w-full rounded-lg border ${errors.pancardNumber ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.pancardNumber && <p className="mt-1 text-sm text-red-600">{errors.pancardNumber}</p>}
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Bank Details</h3>
                  
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      id="bankName"
                      name="bankName"
                      type="text"
                      value={formData.bankName}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.bankName ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
                  </div>

                  <div>
                    <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.bankAccountNumber ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.bankAccountNumber && <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber}</p>}
                  </div>

                  <div>
                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      id="ifscCode"
                      name="ifscCode"
                      type="text"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="ABCD0123456"
                      className={`w-full rounded-lg border ${errors.ifscCode ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.ifscCode && <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Manager Selection */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Manager Information</h3>
                <div>
                  <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Your Manager
                  </label>
                  <select
                    id="managerId"
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.managerId ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    disabled={loadingManagers}
                  >
                    <option value="">-- Select Manager --</option>
                    {loadingManagers ? (
                      <option>Loading managers...</option>
                    ) : (
                      managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.name} ({manager.mobileNumber})
                        </option>
                      ))
                    )}
                  </select>
                  {errors.managerId && <p className="mt-1 text-sm text-red-600">{errors.managerId}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || loadingManagers}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : 'Register Account'}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/salesman/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default SalesmanRegistration;