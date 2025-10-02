// // src/pages/reports/CommissionReport.jsx
// import React from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";

// const CommissionReport = () => {
//   const data = [
//     { name: "John Doe", account: "1234567890", ifsc: "HDFC0001234", commission: "₹5,000" },
//     { name: "Jane Smith", account: "9876543210", ifsc: "SBI0004567", commission: "₹3,200" },
//   ];

//   return (
//     <AdminLayout>
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4 text-white">Commission Report</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 dark:border-gray-300">
//           <thead className="bg-gray-100 dark:bg-gray-300">
//             <tr>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Account Number</th>
//               <th className="px-4 py-2 border">IFSC Code</th>
//               <th className="px-4 py-2 border">Commission (Without TDS)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} className="text-center border-t text-white">
//                 <td className="px-4 py-2 border">{row.name}</td>
//                 <td className="px-4 py-2 border">{row.account}</td>
//                 <td className="px-4 py-2 border">{row.ifsc}</td>
//                 <td className="px-4 py-2 border">{row.commission}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </AdminLayout>
//   );
// };

// export default CommissionReport;



// src/pages/reports/CommissionReport.jsx
import React from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import * as XLSX from "xlsx";

const CommissionReport = () => {
  const data = [
    { name: "John Doe", account: "1234567890", ifsc: "HDFC0001234", commission: "₹5,000" },
    { name: "Jane Smith", account: "9876543210", ifsc: "SBI0004567", commission: "₹3,200" },
  ];

  const exportToExcel = () => {
    // Prepare data for Excel (remove ₹ symbol for better number handling)
    const excelData = data.map(item => ({
      "Name": item.name,
      "Account Number": item.account,
      "IFSC Code": item.ifsc,
      "Commission (Without TDS)": item.commission.replace('₹', '') // Remove ₹ for clean numeric data
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
    worksheet['!cols'] = colWidths;

    // Export to Excel
    XLSX.writeFile(workbook, "Commission_Report.xlsx", { compression: true });
  };

  const exportToExcelWithFormatting = () => {
    // Alternative method with custom formatting
    const worksheetData = [
      ["Name", "Account Number", "IFSC Code", "Commission (Without TDS)"], // Headers
      ...data.map(item => [item.name, item.account, item.ifsc, item.commission])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commission Report");

    // Add some basic styling to header
    if (!worksheet["A1"].s) worksheet["A1"].s = {};
    if (!worksheet["B1"].s) worksheet["B1"].s = {};
    if (!worksheet["C1"].s) worksheet["C1"].s = {};
    if (!worksheet["D1"].s) worksheet["D1"].s = {};

    // Bold headers
    worksheet["A1"].s = { font: { bold: true } };
    worksheet["B1"].s = { font: { bold: true } };
    worksheet["C1"].s = { font: { bold: true } };
    worksheet["D1"].s = { font: { bold: true } };

    XLSX.writeFile(workbook, "Commission_Report_Formatted.xlsx");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">Commission Report</h1>
          <div className="space-x-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Download Excel
            </button>
            {/* <button
              onClick={exportToExcelWithFormatting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Download Formatted Excel
            </button> */}
          </div>
        </div>
        
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
              {data.map((row, idx) => (
                <tr key={idx} className="text-center border-t text-white">
                  <td className="px-4 py-2 border">{row.name}</td>
                  <td className="px-4 py-2 border">{row.account}</td>
                  <td className="px-4 py-2 border">{row.ifsc}</td>
                  <td className="px-4 py-2 border">{row.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CommissionReport;