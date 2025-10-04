// import React from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";
// import * as XLSX from "xlsx";

// const GSTReport = () => {
//   const data = [
//     { invoice: "INV001", customer: "John Doe", gst: "18%", gstAmount: "₹900", total: "₹5,900" },
//     { invoice: "INV002", customer: "Jane Smith", gst: "18%", gstAmount: "₹450", total: "₹2,950" },
//   ];

//   const exportToExcel = () => {
//     // Prepare data for Excel (clean numeric values)
//     const excelData = data.map(item => ({
//       "Invoice No": item.invoice,
//       "Customer Name": item.customer,
//       "GST %": item.gst.replace('%', ''),
//       "GST Amount": item.gstAmount.replace('₹', '').replace(',', ''),
//       "Total Amount": item.total.replace('₹', '').replace(',', '')
//     }));

//     // Create worksheet and workbook
//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

//     // Set column widths for better formatting
//     const colWidths = [
//       { wch: 15 }, // Invoice No
//       { wch: 20 }, // Customer Name
//       { wch: 10 }, // GST %
//       { wch: 15 }, // GST Amount
//       { wch: 15 }, // Total Amount
//     ];
//     worksheet['!cols'] = colWidths;

//     // Export to Excel
//     XLSX.writeFile(workbook, "GST_Report.xlsx", { compression: true });
//   };

//   const exportToExcelWithFormatting = () => {
//     // Method with custom formatting and headers
//     const worksheetData = [
//       ["Invoice No", "Customer Name", "GST %", "GST Amount", "Total Amount"], // Headers
//       ...data.map(item => [
//         item.invoice, 
//         item.customer, 
//         item.gst, 
//         item.gstAmount, 
//         item.total
//       ])
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

//     // Add styling to header row
//     const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1'];
//     headerCells.forEach(cell => {
//       if (!worksheet[cell].s) worksheet[cell].s = {};
//       worksheet[cell].s = { 
//         font: { bold: true, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "4472C4" } } // Blue background
//       };
//     });

//     XLSX.writeFile(workbook, "GST_Report_Formatted.xlsx");
//   };

//   const exportToCSV = () => {
//     const headers = "Invoice No,Customer Name,GST %,GST Amount,Total Amount";
//     const csvRows = data.map(item => 
//       `"${item.invoice}","${item.customer}","${item.gst}","${item.gstAmount}","${item.total}"`
//     );
//     const csvContent = [headers, ...csvRows].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "GST_Report.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold text-white">GST Based Report</h1>
//           <div className="flex space-x-2">
//             <button
//               onClick={exportToExcel}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
//             >
//               Download Excel
//             </button>
           
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 dark:border-gray-300">
//             <thead className="bg-gray-100 dark:bg-gray-300">
//               <tr>
//                 <th className="px-4 py-2 border">Invoice No</th>
//                 <th className="px-4 py-2 border">Customer Name</th>
//                 <th className="px-4 py-2 border">GST %</th>
//                 <th className="px-4 py-2 border">GST Amount</th>
//                 <th className="px-4 py-2 border">Total Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, idx) => (
//                 <tr key={idx} className="text-center border-t text-white">
//                   <td className="px-4 py-2 border">{row.invoice}</td>
//                   <td className="px-4 py-2 border">{row.customer}</td>
//                   <td className="px-4 py-2 border">{row.gst}</td>
//                   <td className="px-4 py-2 border">{row.gstAmount}</td>
//                   <td className="px-4 py-2 border">{row.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Summary Section */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-gray-800 p-4 rounded-lg">
//             <h3 className="text-white font-semibold">Total GST Amount</h3>
//             <p className="text-white text-xl">₹1,350</p>
//           </div>
//           <div className="bg-gray-800 p-4 rounded-lg">
//             <h3 className="text-white font-semibold">Total Invoices</h3>
//             <p className="text-white text-xl">{data.length}</p>
//           </div>
//           <div className="bg-gray-800 p-4 rounded-lg">
//             <h3 className="text-white font-semibold">Average GST</h3>
//             <p className="text-white text-xl">18%</p>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default GSTReport;



import React from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import * as XLSX from "xlsx";

const GSTReport = () => {
  const data = [
    { 
      date: "2024-01-15", 
      invoice: "INV001", 
      shopName: "ABC Traders", 
      grossAmount: "₹5,000", 
      cgst: "₹450", 
      sgst: "₹450", 
      igst: "₹0", 
      total: "₹5,900" 
    },
    { 
      date: "2024-01-16", 
      invoice: "INV002", 
      shopName: "XYZ Enterprises", 
      grossAmount: "₹2,500", 
      cgst: "₹225", 
      sgst: "₹225", 
      igst: "₹0", 
      total: "₹2,950" 
    },
    { 
      date: "2024-01-17", 
      invoice: "INV003", 
      shopName: "Global Imports", 
      grossAmount: "₹8,000", 
      cgst: "₹0", 
      sgst: "₹0", 
      igst: "₹1,440", 
      total: "₹9,440" 
    },
  ];

  // Calculate totals
  const totalGrossAmount = data.reduce((sum, item) => sum + parseInt(item.grossAmount.replace('₹', '').replace(',', '')), 0);
  const totalCGST = data.reduce((sum, item) => sum + parseInt(item.cgst.replace('₹', '').replace(',', '')), 0);
  const totalSGST = data.reduce((sum, item) => sum + parseInt(item.sgst.replace('₹', '').replace(',', '')), 0);
  const totalIGST = data.reduce((sum, item) => sum + parseInt(item.igst.replace('₹', '').replace(',', '')), 0);
  const totalAmount = data.reduce((sum, item) => sum + parseInt(item.total.replace('₹', '').replace(',', '')), 0);

  const exportToExcel = () => {
    // Prepare data for Excel (clean numeric values)
    const excelData = data.map(item => ({
      "Date": item.date,
      "Invoice No": item.invoice,
      "Shop Name": item.shopName,
      "Gross Amount": item.grossAmount.replace('₹', '').replace(',', ''),
      "CGST Amount": item.cgst.replace('₹', '').replace(',', ''),
      "SGST Amount": item.sgst.replace('₹', '').replace(',', ''),
      "IGST Amount": item.igst.replace('₹', '').replace(',', ''),
      "Total Amount": item.total.replace('₹', '').replace(',', '')
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

    // Set column widths for better formatting
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 15 }, // Invoice No
      { wch: 20 }, // Shop Name
      { wch: 15 }, // Gross Amount
      { wch: 15 }, // CGST Amount
      { wch: 15 }, // SGST Amount
      { wch: 15 }, // IGST Amount
      { wch: 15 }, // Total Amount
    ];
    worksheet['!cols'] = colWidths;

    // Export to Excel
    XLSX.writeFile(workbook, "GST_Report.xlsx", { compression: true });
  };

  const exportToExcelWithFormatting = () => {
    // Method with custom formatting and headers
    const worksheetData = [
      ["Date", "Invoice No", "Shop Name", "Gross Amount", "CGST Amount", "SGST Amount", "IGST Amount", "Total Amount"], // Headers
      ...data.map(item => [
        item.date, 
        item.invoice, 
        item.shopName,
        item.grossAmount,
        item.cgst,
        item.sgst,
        item.igst,
        item.total
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

    // Add styling to header row
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'];
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
    const headers = "Date,Invoice No,Shop Name,Gross Amount,CGST Amount,SGST Amount,IGST Amount,Total Amount";
    const csvRows = data.map(item => 
      `"${item.date}","${item.invoice}","${item.shopName}","${item.grossAmount}","${item.cgst}","${item.sgst}","${item.igst}","${item.total}"`
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

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
            <button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
            >
              Download CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-300">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Invoice No</th>
                <th className="px-4 py-2 border">Shop Name</th>
                <th className="px-4 py-2 border">Gross Amount</th>
                <th className="px-4 py-2 border">CGST Amount</th>
                <th className="px-4 py-2 border">SGST Amount</th>
                <th className="px-4 py-2 border">IGST Amount</th>
                <th className="px-4 py-2 border">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="text-center border-t text-white">
                  <td className="px-4 py-2 border">{row.date}</td>
                  <td className="px-4 py-2 border">{row.invoice}</td>
                  <td className="px-4 py-2 border">{row.shopName}</td>
                  <td className="px-4 py-2 border">{row.grossAmount}</td>
                  <td className="px-4 py-2 border">{row.cgst}</td>
                  <td className="px-4 py-2 border">{row.sgst}</td>
                  <td className="px-4 py-2 border">{row.igst}</td>
                  <td className="px-4 py-2 border">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total Gross Amount</h3>
            <p className="text-white text-xl">{formatCurrency(totalGrossAmount)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total CGST</h3>
            <p className="text-white text-xl">{formatCurrency(totalCGST)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total SGST</h3>
            <p className="text-white text-xl">{formatCurrency(totalSGST)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total IGST</h3>
            <p className="text-white text-xl">{formatCurrency(totalIGST)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total Amount</h3>
            <p className="text-white text-xl">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total Invoices</h3>
            <p className="text-white text-xl">{data.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold">Total GST</h3>
            <p className="text-white text-xl">{formatCurrency(totalCGST + totalSGST + totalIGST)}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GSTReport;