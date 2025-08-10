import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSalesmanData } from "../store/salesman/shopSlice"; // Updated import path
import SalesmanSidebar from "../../components/layout/SalesmanSidebar";

const SalesmanShopsDashboard = () => {
  const dispatch = useDispatch();
  const { salesman, loading, error } = useSelector((state) => state.shop); // Changed from state.salesman to state.shop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    dispatch(fetchSalesmanData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
          <p className="mb-3">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchSalesmanData())}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!salesman) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No salesman data found
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
      <SalesmanSidebar 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        salesmanData={salesman}
      />
      
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600">Salesman Commission Dashboard</h1>
        </header>

        {/* Salesman Profile Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                {salesman?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{salesman.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  salesman.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {salesman.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex pb-4 border-b border-gray-100">
                <span className="w-32 text-gray-500 font-medium">Email:</span>
                <span>{salesman.email}</span>
              </div>
              <div className="flex pb-4 border-b border-gray-100">
                <span className="w-32 text-gray-500 font-medium">Mobile:</span>
                <span>{salesman.mobileNumber}</span>
              </div>
              <div className="flex pb-4 border-b border-gray-100">
                <span className="w-32 text-gray-500 font-medium">Agent Code:</span>
                <span>{salesman?.agentCode?.join(", ")}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500 font-medium">Bank Details:</span>
                <span>
                  {salesman.bankName} (A/C: ****
                  {salesman.bankAccountNumber?.slice(-4)})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h3 className="text-gray-500 text-sm mb-2">Total Commission</h3>
              <p className="text-2xl font-bold text-blue-600">
                ₹{salesman.totalCommissionEarned?.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-500 text-sm mb-2">Shops Added</h3>
              <p className="text-2xl font-bold text-blue-600">
                {salesman.shopsAddedBySalesman?.length}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-500 text-sm mb-2">Member Since</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Date(salesman.createdAt)?.toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* Commission Table Section */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Commission Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesman.salesCommissionEarned?.length > 0 ? (
                  salesman.salesCommissionEarned?.map((commission, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {commission.shop.shopName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {commission.shop.locality}, {commission.shop.place}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-red-500">
                        ₹{commission.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(commission._id).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No commission records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SalesmanShopsDashboard;