import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommissionSettings,
  updateCommissionSettings,
  setMessage,
  clearMessage,
} from "../../store/commision/commisionSlice";
import AdminLayout from "../../../components/layout/AdminLayout";
import { CurrencyRupeeIcon, RefreshIcon } from "@heroicons/react/outline";

const CommissionSettings = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("salesman");
  const [formData, setFormData] = React.useState({
    salesCommission: "",
    salesTarget: "",
    subscriptionCommission: "",
    salesmanSalesCommissionForManager: "", // New field
  });

  const { salesman, manager, updateStatus, message, messageType } = useSelector(
    (state) => state.commission
  );

  const currentSettings =
    activeTab === "salesman" ? salesman.settings : manager.settings;
  const loadingStatus =
    activeTab === "salesman" ? salesman.status : manager.status;

  // Format amount to INR currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "Not set";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Fetch current settings when tab changes
  useEffect(() => {
    dispatch(fetchCommissionSettings(activeTab));
  }, [activeTab, dispatch]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.salesCommission &&
      !formData.salesTarget &&
      !formData.subscriptionCommission &&
      !formData.salesmanSalesCommissionForManager
    ) {
      dispatch(
        setMessage({
          message: "Please enter at least one field to update",
          type: "error",
        })
      );
      return;
    }

    dispatch(
      updateCommissionSettings({
        role: activeTab,
        settings: formData,
      })
    );

    // Reset form if update is successful
    if (updateStatus === "succeeded") {
      setFormData({
        salesCommission: "",
        salesTarget: "",
        subscriptionCommission: "",
        salesmanSalesCommissionForManager: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const getCommissionValue = () => {
    if (!currentSettings) return null;
    return activeTab === "salesman"
      ? currentSettings.salesmanCommission
      : currentSettings.managerCommission;
  };

  return (
    <AdminLayout>
      <div className=" p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Commission & Target Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure all commission settings for your team
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === "salesman"
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("salesman")}
          >
            Salesman Settings
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === "manager"
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("manager")}
          >
            Manager Settings
          </button>
        </div>

        {/* Current Settings */}
        {loadingStatus === "loading" ? (
          <div className="flex justify-center items-center p-8">
            <RefreshIcon className="h-5 w-5 text-gray-400 animate-spin" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              Loading current settings...
            </span>
          </div>
        ) : loadingStatus === "failed" ? (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
            Failed to load settings:{" "}
            {activeTab === "salesman" ? salesman.error : manager.error}
          </div>
        ) : currentSettings ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Current Settings
            </h3>
            <div
              className={`grid grid-cols-1 ${
                activeTab === "manager" ? "md:grid-cols-4" : "md:grid-cols-3"
              } gap-4`}
            >
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sales Commission
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(getCommissionValue())}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sales Target
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(currentSettings.salesTarget)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Subscription Commission
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(currentSettings.subscriptionCommission)}
                </p>
              </div>
              {activeTab === "manager" && (
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Commission from Salesman Sales
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      currentSettings.salesmanSalesCommissionForManager
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Update Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Update {activeTab === "salesman" ? "Salesman" : "Manager"} Settings
          </h3>

          <div className="space-y-4">
            {/* Sales Commission */}
            <div>
              <label
                htmlFor="salesCommission"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Subscription Commission (₹)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="salesCommission"
                  name="salesCommission"
                  type="text"
                  value={formData.salesCommission}
                  onChange={handleInputChange}
                  placeholder={`Enter new sales commission`}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Sales Target */}
            <div>
              <label
                htmlFor="salesTarget"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Monthly Sales Target (₹)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="salesTarget"
                  name="salesTarget"
                  type="text"
                  value={formData.salesTarget}
                  onChange={handleInputChange}
                  placeholder={`Enter new sales target`}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Subscription Commission */}
            <div>
              <label
                htmlFor="subscriptionCommission"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Renewal Commission (₹)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="subscriptionCommission"
                  name="subscriptionCommission"
                  type="text"
                  value={formData.subscriptionCommission}
                  onChange={handleInputChange}
                  placeholder={`Enter new subscription commission`}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Manager-specific field: Commission from Salesman Sales */}
            {activeTab === "manager" && (
              <div>
                <label
                  htmlFor="salesmanSalesCommissionForManager"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Commission from Salesman Sales (₹)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="salesmanSalesCommissionForManager"
                    name="salesmanSalesCommissionForManager"
                    type="text"
                    value={formData.salesmanSalesCommissionForManager}
                    onChange={handleInputChange}
                    placeholder="Enter commission from salesman sales"
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={
                updateStatus === "loading" ||
                (!formData.salesCommission &&
                  !formData.salesTarget &&
                  !formData.subscriptionCommission &&
                  !formData.salesmanSalesCommissionForManager)
              }
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                updateStatus === "loading" ||
                (!formData.salesCommission &&
                  !formData.salesTarget &&
                  !formData.subscriptionCommission &&
                  !formData.salesmanSalesCommissionForManager)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {updateStatus === "loading" ? (
                <>
                  <RefreshIcon className="h-5 w-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                `Update ${
                  activeTab === "salesman" ? "Salesman" : "Manager"
                } Settings`
              )}
            </button>
          </div>
        </form>

        {/* Message Alert */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-md ${
              messageType === "success"
                ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center">
              {messageType === "success" ? (
                <svg
                  className="h-5 w-5 text-green-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CommissionSettings;
