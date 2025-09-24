// src/pages/reports/TDSReport.jsx
import React from "react";

const TDSReport = () => {
  const data = [
    { name: "John Doe", pan: "ABCDE1234F", tds: "10%", deducted: "₹500", net: "₹4,500" },
    { name: "Jane Smith", pan: "WXYZ9876K", tds: "10%", deducted: "₹320", net: "₹2,880" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">TDS Based Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
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
              <tr key={idx} className="text-center border-t">
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
    </div>
  );
};

export default TDSReport;
