import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSalesmen,
  deleteSalesman,
} from "../../store/salesmans/salesmanSlice";
import AdminLayout from "../../../components/layout/AdminLayout";

const SalesmanPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { salesmen, loading, error } = useSelector((state) => state.salesmans);

  useEffect(() => {
    dispatch(fetchSalesmen());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this salesman?")) {
      dispatch(deleteSalesman(id));
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header + Add button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Salesmen</h1>
          <button
            onClick={() => navigate("/salesman/register")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Salesman
          </button>
        </div>

        {loading && <p>Loading salesmen...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Mobile</th>
              <th className="border border-gray-300 px-4 py-2">Manager</th>
              <th className="border border-gray-300 px-4 py-2">
                Commission Earned
              </th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesmen?.length > 0 ? (
              salesmen.map((salesman) => (
                <tr key={salesman._id} className="text-white">
                  <td className="border border-gray-300 px-4 py-2">
                    {salesman.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {salesman.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {salesman.mobileNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {salesman.manager?.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {salesman.salesCommissionEarned &&
                    salesman.salesCommissionEarned.length > 0
                      ? salesman.salesCommissionEarned.reduce(
                          (total, entry) => total + (entry.amount || 0),
                          0
                        )
                      : 0}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(salesman._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border border-gray-300 px-4 py-2 text-center text-red-600"
                >
                  No salesmen found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default SalesmanPage;
