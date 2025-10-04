// // src/pages/reports/TDSReport.jsx
// import React from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";

// const TDSReport = () => {
//   const data = [
//     { name: "John Doe", pan: "ABCDE1234F", tds: "10%", deducted: "₹500", net: "₹4,500" },
//     { name: "Jane Smith", pan: "WXYZ9876K", tds: "10%", deducted: "₹320", net: "₹2,880" },
//   ];

//   return (
//     <AdminLayout>
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4 text-white">TDS Based Report</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 dark:border-gray-300">
//           <thead className="bg-gray-100 dark:bg-gray-300">
//             <tr>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">PAN</th>
//               <th className="px-4 py-2 border">TDS %</th>
//               <th className="px-4 py-2 border">TDS Deducted</th>
//               <th className="px-4 py-2 border">Net Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} className="text-center border-t text-white">
//                 <td className="px-4 py-2 border">{row.name}</td>
//                 <td className="px-4 py-2 border">{row.pan}</td>
//                 <td className="px-4 py-2 border">{row.tds}</td>
//                 <td className="px-4 py-2 border">{row.deducted}</td>
//                 <td className="px-4 py-2 border">{row.net}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </AdminLayout>
//   );
// };

// export default TDSReport;



// src/pages/reports/TDSReport.jsx
import React from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import * as XLSX from "xlsx";

const TDSReport = () => {
  const data = [
    { name: "John Doe", pan: "ABCDE1234F", tds: "10%", deducted: "₹500", net: "₹4,500" },
    { name: "Jane Smith", pan: "WXYZ9876K", tds: "10%", deducted: "₹320", net: "₹2,880" },
  ];

  const exportToExcel = () => {
    // Prepare data for Excel (clean numeric values)
    const excelData = data.map(item => ({
      "Name": item.name,
      "PAN": item.pan,
      "TDS %": item.tds.replace('%', ''),
      "TDS Deducted": item.deducted.replace('₹', '').replace(',', ''),
      "Net Amount": item.net.replace('₹', '').replace(',', '')
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TDS Report");

    // Set column widths for better formatting
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // PAN
      { wch: 10 }, // TDS %
      { wch: 15 }, // TDS Deducted
      { wch: 15 }, // Net Amount
    ];
    worksheet['!cols'] = colWidths;

    // Export to Excel
    XLSX.writeFile(workbook, "TDS_Report.xlsx", { compression: true });
  };

  const exportToExcelWithFormatting = () => {
    // Method with custom formatting and headers
    const worksheetData = [
      ["Name", "PAN", "TDS %", "TDS Deducted", "Net Amount"], // Headers
      ...data.map(item => [
        item.name, 
        item.pan, 
        item.tds, 
        item.deducted, 
        item.net
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TDS Report");

    // Add styling to header row
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1'];
    headerCells.forEach(cell => {
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s = { 
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2E75B6" } } // Professional blue background
      };
    });

    XLSX.writeFile(workbook, "TDS_Report_Formatted.xlsx");
  };

  const exportToCSV = () => {
    const headers = "Name,PAN,TDS %,TDS Deducted,Net Amount";
    const csvRows = data.map(item => 
      `"${item.name}","${item.pan}","${item.tds}","${item.deducted}","${item.net}"`
    );
    const csvContent = [headers, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "TDS_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate summary statistics
  const totalTDSDeducted = data.reduce((sum, item) => {
    return sum + parseInt(item.deducted.replace('₹', '').replace(',', ''));
  }, 0);

  const totalNetAmount = data.reduce((sum, item) => {
    return sum + parseInt(item.net.replace('₹', '').replace(',', ''));
  }, 0);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">TDS Based Report</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
            >
              Download Excel
            </button>
            
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-300">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">PAN</th>
                <th className="px-4 py-2 border">TDS %</th>
                <th className="px-4 py-2 border">TDS Deducted</th>
                <th className="px-4 py-2 border">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="text-center border-t text-white">
                  <td className="px-4 py-2 border">{row.name}</td>
                  <td className="px-4 py-2 border">{row.pan}</td>
                  <td className="px-4 py-2 border">{row.tds}</td>
                  <td className="px-4 py-2 border">{row.deducted}</td>
                  <td className="px-4 py-2 border">{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold text-sm">Total TDS Deducted</h3>
            <p className="text-white text-xl">₹{totalTDSDeducted.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold text-sm">Total Net Amount</h3>
            <p className="text-white text-xl">₹{totalNetAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold text-sm">Total Records</h3>
            <p className="text-white text-xl">{data.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold text-sm">Average TDS %</h3>
            <p className="text-white text-xl">10%</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TDSReport;