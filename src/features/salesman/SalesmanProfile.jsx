import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import {
  PencilIcon,
  SaveIcon,
  XIcon,
  UserIcon,
  CreditCardIcon,
  CurrencyDollarIcon
} from "@heroicons/react/outline";
import SalesmanSidebar from "../../components/layout/SalesmanSidebar";
import { fetchSalesmanData, updateSalesmanData, setEditing, resetError } from "../store/salesman/proffileSlice";

const SalesmanProfile = () => {
  const dispatch = useDispatch();
  const {
    data: salesman,
    loading,
    error,
    isEditing
  } = useSelector((state) => state.salesman);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("salesmanToken");
    if (!token) {
      window.location.href = "/salesman/login";
      return;
    }
    dispatch(fetchSalesmanData());
  }, [dispatch]);

  useEffect(() => {
    if (salesman) {
      setFormData({
        name: salesman.name || "",
        email: salesman.email || "",
        mobileNumber: salesman.mobileNumber || "",
        bankName: salesman.bankName || "",
        bankAccountNumber: salesman.bankAccountNumber || "",
        ifscCode: salesman.ifscCode || "",
      });
    }
  }, [salesman]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSalesmanData(formData));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          <p className="mb-3">Error: {error}</p>
          <button
            onClick={() => {
              dispatch(resetError());
              dispatch(fetchSalesmanData());
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!salesman) return null;

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
      <SalesmanSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        salesmanData={salesman}
      />

      <div className="flex-1 p-8 transition-all duration-300">
        <div className="max-w-5xl w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white flex justify-between items-center">
            <h1 className="text-xl font-semibold">Salesman Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => dispatch(setEditing(true))}
                className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-medium transition-colors"
              >
                <PencilIcon className="h-5 w-5" /> Edit
              </button>
            ) : (
              <button
                onClick={() => dispatch(setEditing(false))}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                <XIcon className="h-5 w-5" /> Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <UserIcon className="h-5 w-5 text-blue-500" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <CurrencyDollarIcon className="h-5 w-5 text-blue-500" /> Bank Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData?.bankName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData?.bankAccountNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData?.ifscCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    <SaveIcon className="h-5 w-5" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                    {salesman?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{salesman?.name}</h2>
                    <p className="text-gray-600">{salesman?.email}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <UserIcon className="h-5 w-5 text-blue-500" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-800">{salesman?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-800">{salesman?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="font-medium text-gray-800">{salesman?.mobileNumber}</p>
                    </div>
                  </div>
                </div>

                {salesman.bankAccountNumber && (
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <CreditCardIcon className="h-5 w-5 text-blue-500" /> Bank Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-800">{salesman?.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="font-medium text-gray-800">{salesman?.bankAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">IFSC Code</p>
                        <p className="font-medium text-gray-800">{salesman?.ifscCode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesmanProfile;