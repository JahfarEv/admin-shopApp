import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ManagerSidebar from "../../components/layout/ManagerSidebar";

export default function ManagerDashboard() {
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const getManagerIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("managerToken");
        if (!token) {
          navigate("/manager/login");
          return;
        }

        const managerId = getManagerIdFromToken(token);
        if (!managerId) {
          throw new Error("Unable to get manager ID from token");
        }

        const res = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/manager/details/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch manager details");
        }

        const data = await res.json();
        setManagerData(data.manager);
      } catch (err) {
        console.error("Error fetching manager dashboard data:", err);
        setError(err.message);
        if (
          err.message.includes("invalid token") ||
          err.message.includes("jwt malformed")
        ) {
          localStorage.removeItem("managerToken");
          navigate("/manager/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-center text-gray-700 mb-6">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
      <ManagerSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        managerData={managerData}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                managerData?.isApproved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {managerData?.isApproved ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {managerData?.isApproved ? "Approved" : "Pending Approval"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, <span className="text-blue-600">{managerData?.name || "Manager"}</span>!
            </h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your team today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Team Members Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Team Members</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-1">24</p>
                  <p className="text-sm text-gray-500 mt-1">Active this month</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sales Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">This Month's Sales</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-1">₹1,42,500</p>
                  <p className="text-sm text-green-500 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Approvals Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-1">5</p>
                  <p className="text-sm text-gray-500 mt-1">Waiting for your review</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Details Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Email:</span>
                    <span className="text-gray-800">{managerData?.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Mobile:</span>
                    <span className="text-gray-800">{managerData?.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Card */}
            {managerData?.bankAccountNumber && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Bank Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Bank Name:</span>
                      <span className="text-gray-800">{managerData.bankName}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Account Number:</span>
                      <span className="text-gray-800">{managerData.bankAccountNumber}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">IFSC Code:</span>
                      <span className="text-gray-800">{managerData.ifscCode}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-gray-500 font-medium">PAN Number:</span>
                      <span className="text-gray-800">{managerData.pancardNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}