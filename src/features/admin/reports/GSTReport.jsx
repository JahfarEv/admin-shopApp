// // src/pages/reports/GSTReport.jsx
// import React from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";

// const GSTReport = () => {
//   const data = [
//     { invoice: "INV001", customer: "John Doe", gst: "18%", gstAmount: "₹900", total: "₹5,900" },
//     { invoice: "INV002", customer: "Jane Smith", gst: "18%", gstAmount: "₹450", total: "₹2,950" },
//   ];

//   return (
//     <AdminLayout>
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4 text-white">GST Based Report</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 dark:border-gray-300">
//           <thead className="bg-gray-100 dark:bg-gray-300">
//             <tr>
//               <th className="px-4 py-2 border">Invoice No</th>
//               <th className="px-4 py-2 border">Customer Name</th>
//               <th className="px-4 py-2 border">GST %</th>
//               <th className="px-4 py-2 border">GST Amount</th>
//               <th className="px-4 py-2 border">Total Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, idx) => (
//               <tr key={idx} className="text-center border-t text-white">
//                 <td className="px-4 py-2 border">{row.invoice}</td>
//                 <td className="px-4 py-2 border">{row.customer}</td>
//                 <td className="px-4 py-2 border">{row.gst}</td>
//                 <td className="px-4 py-2 border">{row.gstAmount}</td>
//                 <td className="px-4 py-2 border">{row.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </AdminLayout>
//   );
// };

// export default GSTReport;


// src/pages/reports/GSTReport.jsx
import React from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import * as XLSX from "xlsx";

const GSTReport = () => {
  const data = [
    { invoice: "INV001", customer: "John Doe", gst: "18%", gstAmount: "₹900", total: "₹5,900" },
    { invoice: "INV002", customer: "Jane Smith", gst: "18%", gstAmount: "₹450", total: "₹2,950" },
  ];

  const exportToExcel = () => {
    // Prepare data for Excel (clean numeric values)
    const excelData = data.map(item => ({
      "Invoice No": item.invoice,
      "Customer Name": item.customer,
      "GST %": item.gst.replace('%', ''),
      "GST Amount": item.gstAmount.replace('₹', '').replace(',', ''),
      "Total Amount": item.total.replace('₹', '').replace(',', '')
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

    // Set column widths for better formatting
    const colWidths = [
      { wch: 15 }, // Invoice No
      { wch: 20 }, // Customer Name
      { wch: 10 }, // GST %
      { wch: 15 }, // GST Amount
      { wch: 15 }, // Total Amount
    ];
    worksheet['!cols'] = colWidths;

    // Export to Excel
    XLSX.writeFile(workbook, "GST_Report.xlsx", { compression: true });
  };

  const exportToExcelWithFormatting = () => {
    // Method with custom formatting and headers
    const worksheetData = [
      ["Invoice No", "Customer Name", "GST %", "GST Amount", "Total Amount"], // Headers
      ...data.map(item => [
        item.invoice, 
        item.customer, 
        item.gst, 
        item.gstAmount, 
        item.total
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

    // Add styling to header row
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1'];
    headerCells.forEach(cell => {
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s = { 
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } } // Blue background
      };
    });

    XLSX.writeFile(workbook, "GST_Report_Formatted.xlsx");
  };

  const exportToCSV = () => {
    const headers = "Invoice No,Customer Name,GST %,GST Amount,Total Amount";
    const csvRows = data.map(item => 
      `"${item.invoice}","${item.customer}","${item.gst}","${item.gstAmount}","${item.total}"`
    );
    const csvContent = [headers, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GST_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">GST Based Report</h1>
          <div className="flex space-x-2">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
            >
              Download Excel
            </button>
            {/* <button
              onClick={exportToExcelWithFormatting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
            >
              Formatted Excel
            </button>
            <button
              onClick={exportToCSV}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
            >
              Download CSV
            </button> */}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-300">
              <tr>
                <th className="px-4 py-2 border">Invoice No</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">GST %</th>
                <th className="px-4 py-2 border">GST Amount</th>
                <th className="px-4 py-2 border">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="text-center border-t text-white">
                  <td className="px-4 py-2 border">{row.invoice}</td>
                  <td className="px-4 py-2 border">{row.customer}</td>
                  <td className="px-4 py-2 border">{row.gst}</td>
                  <td className="px-4 py-2 border">{row.gstAmount}</td>
                  <td className="px-4 py-2 border">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total GST Amount</h3>
            <p className="text-white text-xl">₹1,350</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total Invoices</h3>
            <p className="text-white text-xl">{data.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Average GST</h3>
            <p className="text-white text-xl">18%</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GSTReport;