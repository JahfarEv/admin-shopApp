// src/pages/reports/CommissionReport.jsx
import React from "react";

const CommissionReport = () => {
  const data = [
    { name: "John Doe", account: "1234567890", ifsc: "HDFC0001234", commission: "₹5,000" },
    { name: "Jane Smith", account: "9876543210", ifsc: "SBI0004567", commission: "₹3,200" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Commission Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Account Number</th>
              <th className="px-4 py-2 border">IFSC Code</th>
              <th className="px-4 py-2 border">Commission (Without TDS)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="text-center border-t">
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
  );
};

export default CommissionReport;
