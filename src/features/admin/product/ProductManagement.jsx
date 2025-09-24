import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShops,
  toggleShopBan,
  deleteShop,
  setSearchKeyword,
  clearError,
  filterShops,
} from "../../../features/store/shop/shopSlice";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  SearchIcon,
  BanIcon,
  TrashIcon,
  PencilAltIcon,
} from "@heroicons/react/outline";

export default function ProductManagement() {
  const dispatch = useDispatch();
  const { shops, filteredShops, loading, error, searchKeyword } = useSelector(
    (state) => state.shops
  );

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      dispatch(fetchShops());
    } else {
      dispatch(filterShops());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleToggleBan = (shopId) => {
    if (window.confirm("Are you sure you want to toggle ban status?")) {
      dispatch(toggleShopBan(shopId));
    }
  };

  const handleDelete = (shopId) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      dispatch(deleteShop(shopId));
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shop Management
          </h2>
          <Link
            to="/admin/shops/add-new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Shop
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search shops by name, email, or mobile"
              value={searchKeyword}
              onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
              onKeyPress={handleKeyPress}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={() => dispatch(clearError())}
              className="ml-2 text-red-800 dark:text-red-200 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Shops Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop._id} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  {/* Shop Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={shop?.headerImage || "/images/shop-fallback.png"}
                      alt={shop?.shopName || "Shop"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        if (
                          e.target.src !==
                          window.location.origin + "/images/shop-fallback.png"
                        ) {
                          e.target.src = "/images/shop-fallback.png";
                        }
                      }}
                    />
                  </div>

                  {/* Shop Info */}
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {shop?.shopName}
                      {shop?.isBanned && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                          Banned
                        </span>
                      )}
                    </h3>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          Category:
                        </span>{" "}
                        {shop?.category?.join(", ") || "N/A"}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          Contact:
                        </span>{" "}
                        {shop.mobileNumber || shop.landlineNumber || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <Link
                      to={`/admin/shops/edit/${shop._id}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <PencilAltIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <Link
                      to={`/admin/shops/products/${shop._id}`}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    >
                      View Products
                    </Link>
                    <button
                      onClick={() => handleToggleBan(shop._id)}
                      className={`text-sm flex items-center ${
                        shop.isBanned
                          ? "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          : "text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                      }`}
                    >
                      <BanIcon className="h-4 w-4 mr-1" />
                      {shop.isBanned ? "Unban" : "Ban"}
                    </button>
                    <button
                      onClick={() => handleDelete(shop._id)}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredShops.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No shops found
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchKeyword.trim()
                  ? "Try a different search term"
                  : "No shops available yet"}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
