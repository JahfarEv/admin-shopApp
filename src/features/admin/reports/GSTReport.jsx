// src/pages/reports/GSTReport.jsx
import React from "react";

const GSTReport = () => {
  const data = [
    { invoice: "INV001", customer: "John Doe", gst: "18%", gstAmount: "₹900", total: "₹5,900" },
    { invoice: "INV002", customer: "Jane Smith", gst: "18%", gstAmount: "₹450", total: "₹2,950" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">GST Based Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
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
              <tr key={idx} className="text-center border-t">
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
    </div>
  );
};

export default GSTReport;
