
// import React from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";
// import * as XLSX from "xlsx";

// const CommissionReport = () => {
//   const data = [
//     {
//       name: "John Doe",
//       account: "1234567890",
//       ifsc: "HDFC0001234",
//       commission: "₹5,000",
//     },
//     {
//       name: "Jane Smith",
//       account: "9876543210",
//       ifsc: "SBI0004567",
//       commission: "₹3,200",
//     },
//   ];

//   const exportToExcel = () => {
//     // Prepare data for Excel (remove ₹ symbol for better number handling)
//     const excelData = data.map((item) => ({
//       Name: item.name,
//       "Account Number": item.account,
//       "IFSC Code": item.ifsc,
//       "Commission (Without TDS)": item.commission.replace("₹", ""), // Remove ₹ for clean numeric data
//     }));

//     // Create worksheet and workbook
//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Commission Report");

//     // Set column widths for better formatting
//     const colWidths = [
//       { wch: 20 }, // Name
//       { wch: 15 }, // Account Number
//       { wch: 15 }, // IFSC Code
//       { wch: 25 }, // Commission
//     ];
//     worksheet["!cols"] = colWidths;

//     // Export to Excel
//     XLSX.writeFile(workbook, "Commission_Report.xlsx", { compression: true });
//   };

 

//   return (
//     <AdminLayout>
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold text-white">Commission Report</h1>
//           <div className="space-x-2">
//             <button
//               onClick={exportToExcel}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
//             >
//               Download Excel
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 dark:border-gray-300">
//             <thead className="bg-gray-100 dark:bg-gray-300">
//               <tr>
//                 <th className="px-4 py-2 border">Name</th>
//                 <th className="px-4 py-2 border">Account Number</th>
//                 <th className="px-4 py-2 border">IFSC Code</th>
//                 <th className="px-4 py-2 border">Commission (Without TDS)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, idx) => (
//                 <tr key={idx} className="text-center border-t text-white">
//                   <td className="px-4 py-2 border">{row.name}</td>
//                   <td className="px-4 py-2 border">{row.account}</td>
//                   <td className="px-4 py-2 border">{row.ifsc}</td>
//                   <td className="px-4 py-2 border">{row.commission}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default CommissionReport;


import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import * as XLSX from "xlsx";

const CommissionReport = () => {
  const [commissionData, setCommissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch commission data from API
  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/adminDashboard/advertisements/68c8030cadb18510ffc37b9f");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Transform API data to match our frontend structure
          const transformedData = transformApiData(result.data);
          setCommissionData(transformedData);
        } else {
          throw new Error(result.message || "Failed to fetch commission data");
        }
      } catch (err) {
        console.error("Error fetching commission data:", err);
        setError(err.message || "Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, []);

  // Transform API response to frontend format
  const transformApiData = (apiData) => {
    const transformed = [];

    // Process managers
    if (apiData.managers && Array.isArray(apiData.managers)) {
      apiData.managers.forEach(manager => {
        // Calculate total commission from manager's commissions array
        const totalCommission = manager.commissions && Array.isArray(manager.commissions) 
          ? manager.commissions.reduce((sum, commission) => {
              // Assuming commission has an 'amount' field, adjust based on your actual data structure
              return sum + (commission.amount || 0);
            }, 0)
          : 0;

        transformed.push({
          name: manager.name || "N/A",
          account: manager.bankAccountNumber || "N/A",
          ifsc: manager.ifscCode || "N/A",
          commission: `₹${totalCommission.toLocaleString()}`,
          // Store raw data for reference
          rawData: manager
        });
      });
    }

    // Process salesmen
    if (apiData.salesmen && Array.isArray(apiData.salesmen)) {
      apiData.salesmen.forEach(salesman => {
        // Calculate total commission from salesman's commissions array
        const totalCommission = salesman.commissions && Array.isArray(salesman.commissions) 
          ? salesman.commissions.reduce((sum, commission) => {
              return sum + (commission.amount || 0);
            }, 0)
          : 0;

        transformed.push({
          name: salesman.name || "N/A",
          account: salesman.bankAccountNumber || "N/A",
          ifsc: salesman.ifscCode || "N/A",
          commission: `₹${totalCommission.toLocaleString()}`,
          rawData: salesman
        });
      });
    }

    return transformed;
  };

  const exportToExcel = () => {
    if (commissionData.length === 0) {
      alert("No data available to export");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = commissionData.map((item) => ({
        Name: item.name,
        "Account Number": item.account,
        "IFSC Code": item.ifsc,
        "Commission (Without TDS)": item.commission.replace("₹", ""),
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Commission Report");

      // Set column widths for better formatting
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 15 }, // Account Number
        { wch: 15 }, // IFSC Code
        { wch: 25 }, // Commission
      ];
      worksheet["!cols"] = colWidths;

      // Export to Excel
      XLSX.writeFile(workbook, "Commission_Report.xlsx", { compression: true });
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("Error exporting data to Excel");
    }
  };

  // Refresh data function
  const refreshData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8000/adminDashboard/all-stafs");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const transformedData = transformApiData(result.data);
        setCommissionData(transformedData);
      } else {
        throw new Error(result.message || "Failed to fetch commission data");
      }
    } catch (err) {
      console.error("Error refreshing commission data:", err);
      setError(err.message || "Something went wrong while refreshing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">Commission Report</h1>
          {/* <div className="space-x-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={exportToExcel}
              disabled={commissionData.length === 0 || loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel
            </button>
          </div> */}


           <div className="flex gap-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={exportToExcel}
              disabled={commissionData.length === 0 || loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-white mt-4">Loading commission data...</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-300">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Account Number</th>
                  <th className="px-4 py-2 border">IFSC Code</th>
                  <th className="px-4 py-2 border">Commission (Without TDS)</th>
                </tr>
              </thead>
              <tbody>
                {commissionData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-white border">
                      No commission data available
                    </td>
                  </tr>
                ) : (
                  commissionData.map((row, idx) => (
                    <tr key={idx} className="text-center border-t text-white hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-2 border">{row.name}</td>
                      <td className="px-4 py-2 border">{row.account}</td>
                      <td className="px-4 py-2 border">{row.ifsc}</td>
                      <td className="px-4 py-2 border font-semibold">{row.commission}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && commissionData.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600 p-4 rounded-lg text-white">
              <h3 className="font-semibold">Total People</h3>
              <p className="text-2xl font-bold">{commissionData.length}</p>
            </div>
            <div className="bg-green-600 p-4 rounded-lg text-white">
              <h3 className="font-semibold">Total Commission</h3>
              <p className="text-2xl font-bold">
                ₹{commissionData.reduce((sum, item) => {
                  const amount = parseInt(item.commission.replace(/[₹,]/g, '')) || 0;
                  return sum + amount;
                }, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-600 p-4 rounded-lg text-white">
              <h3 className="font-semibold">Last Updated</h3>
              <p className="text-lg">{new Date().toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CommissionReport;