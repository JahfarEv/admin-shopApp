import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchManagers,
  deleteManager,
} from "../../store/managers/managersSlice";
import AdminLayout from "../../../components/layout/AdminLayout";

const ManagersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { managers, loading, error } = useSelector((state) => state.manager);

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      dispatch(deleteManager(id));
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header + Add button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Managers</h1>
          <button
            onClick={() => navigate("/manager/register")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Manager
          </button>
        </div>

        {loading && <p>Loading managers...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Mobile</th>
              <th className="border border-gray-300 px-4 py-2">
                Assigned Salesmen
              </th>

              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers?.length > 0 ? (
              managers.map((manager) => (
                <tr key={manager._id} className="text-white">
                  <td className="border border-gray-300 px-4 py-2">
                    {manager.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {manager.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {manager.mobileNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {manager.assignedSalesmen?.length > 0 ? (
                      <select className="bg-gray-700 text-white px-2 py-1 rounded w-full">
                        {manager.assignedSalesmen.map((salesman) => (
                          <option key={salesman._id} value={salesman._id}>
                            {salesman.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "None"
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(manager._id)}
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
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-center text-red-600"
                >
                  No managers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManagersPage;
