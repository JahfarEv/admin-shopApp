import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";

const AllSalesmen = () => {
  const [salesmen, setSalesmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Get token from localStorage or wherever you store it
  const getAdminToken = () => {
    return localStorage.getItem("adminToken") || "";
  };

  useEffect(() => {
    fetchAllSalesmen();
  }, []);

  const fetchAllSalesmen = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();

      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/salesman`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle unauthorized error
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error("Failed to fetch salesmen");
      }

      const data = await response.json();

      // Check the API response structure and adjust accordingly
      if (data.success && data.data) {
        setSalesmen(data.data);
      } else if (Array.isArray(data)) {
        // Fallback if API returns array directly
        setSalesmen(data);
      } else if (data.data) {
        // Another common response structure
        setSalesmen(data.data);
      } else {
        setSalesmen([]);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleApprove = async (salesmanId) => {
    try {
      setUpdatingId(salesmanId);
      const token = getAdminToken();

      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/adminDashboard/approve/salesman/${salesmanId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error("Failed to approve salesman");
      }

      // Refresh the list after approval
      await fetchAllSalesmen();

      setSuccessMessage("Salesman approved successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Approved
        </span>
      );
    }
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  // Handle logout if token is invalid
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    // Redirect to login page
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            {error.includes("Unauthorized") && (
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
              >
                Login Again
              </button>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">All Salesmen</h1>

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {salesmen.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            No salesmen found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesmen.map((salesman) => (
                  <tr key={salesman._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {salesman.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {salesman.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {salesman.mobileNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {salesman.manager?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(salesman.isApproved)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salesman.isApproved ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
                        >
                          Approved
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(salesman._id)}
                          disabled={updatingId === salesman._id}
                          className={`px-4 py-2 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                            updatingId === salesman._id
                              ? "bg-green-400"
                              : "bg-green-600"
                          }`}
                        >
                          {updatingId === salesman._id
                            ? "Approving..."
                            : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllSalesmen;
