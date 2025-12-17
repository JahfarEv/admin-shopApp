import React, { useEffect, useState } from "react";
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
  EyeIcon,
  PhoneIcon,
  TagIcon,
  ExclamationCircleIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingBagIcon,
  CollectionIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";

// Or use solid icons if BuildingStorefrontIcon is needed
// import { BuildingStorefrontIcon } from "@heroicons/react/solid";

export default function ShopManagement() {
  const dispatch = useDispatch();
  const { shops, filteredShops, loading, error, searchKeyword } = useSelector(
    (state) => state.shops
  );
  const [mobileView, setMobileView] = useState(false);
  const [expandedShopId, setExpandedShopId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    banned: 0,
    active: 0,
  });

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  useEffect(() => {
    const updateStats = () => {
      const total = shops.length;
      const banned = shops.filter(shop => shop.isBanned).length;
      setStats({
        total,
        banned,
        active: total - banned
      });
    };
    
    updateStats();
  }, [shops]);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleToggleBan = (shopId, shopName) => {
    const action = shops.find(s => s._id === shopId)?.isBanned ? "unban" : "ban";
    if (window.confirm(`Are you sure you want to ${action} "${shopName}"?`)) {
      dispatch(toggleShopBan(shopId));
    }
  };

  const handleDelete = (shopId, shopName) => {
    if (window.confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone.`)) {
      dispatch(deleteShop(shopId));
    }
  };

  const toggleExpand = (shopId) => {
    setExpandedShopId(expandedShopId === shopId ? null : shopId);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Shop Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage all registered shops and their status
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Shops</p>
                    <p className="text-white text-2xl font-bold">{stats.total}</p>
                  </div>
                  <ShoppingBagIcon className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active</p>
                    <p className="text-white text-2xl font-bold">{stats.active}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Banned</p>
                    <p className="text-white text-2xl font-bold">{stats.banned}</p>
                  </div>
                  <BanIcon className="h-8 w-8 text-red-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search shops by name, email, or mobile number..."
                value={searchKeyword}
                onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
                onKeyPress={handleKeyPress}
                className="block w-full pl-10 pr-4 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredShops.length} of {shops.length} shops
            </span>
            {searchKeyword && (
              <button
                onClick={() => {
                  dispatch(setSearchKeyword(""));
                  dispatch(fetchShops());
                }}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
              >
                <XIcon className="h-4 w-4 mr-1" />
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading shops...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 mb-6 md:mb-8">
            <div className="flex items-start">
              <ExclamationCircleIcon className="h-6 w-6 text-white mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-semibold">Error</p>
                <p className="text-red-100 mt-1">{error}</p>
              </div>
              <button
                onClick={() => dispatch(clearError())}
                className="ml-4 text-white hover:text-red-200 transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile View - Accordion */}
        {!loading && mobileView && (
          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700"
              >
                {/* Shop Header */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(shop._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={
                            shop?.headerImage?.trim() || "/images/shop-header-default.jpg"
                          }
                          alt={shop?.shopName}
                          className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.currentTarget.src = "/images/store.png";
                          }}
                        />
                        {shop.isBanned && (
                          <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                            <BanIcon className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {shop?.shopName || "Unnamed Shop"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {shop.mobileNumber || shop.landlineNumber || "No contact"}
                        </p>
                      </div>
                    </div>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedShopId === shop._id ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedShopId === shop._id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Categories
                        </label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {shop?.category?.map((cat, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-lg flex items-center"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {cat}
                            </span>
                          )) || "N/A"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to={`/admin/shops/edit/${shop._id}`}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                        >
                          <PencilAltIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                        <Link
                          to={`/admin/shops/products/${shop._id}`}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Products
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleToggleBan(shop._id, shop.shopName)}
                          className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                            shop.isBanned
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                              : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                          }`}
                        >
                          <BanIcon className="h-4 w-4 mr-2" />
                          {shop.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => handleDelete(shop._id, shop.shopName)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop View - Grid */}
        {!loading && !mobileView && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 dark:border-gray-700 h-full flex flex-col"
              >
                {/* Shop Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      shop?.headerImage?.trim() || "/images/shop-header-default.jpg"
                    }
                    alt={shop?.shopName}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "/images/store.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {shop.isBanned ? (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center">
                        <BanIcon className="h-3 w-3 mr-1" />
                        BANNED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Shop Info */}
                <div className="p-6 flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                      {shop?.shopName || "Unnamed Shop"}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                      <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {shop.mobileNumber || shop.landlineNumber || "No contact"}
                      </span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {shop?.category?.slice(0, 3).map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-medium rounded-lg flex items-center"
                        >
                          <TagIcon className="h-3 w-3 mr-1.5" />
                          {cat}
                        </span>
                      ))}
                      {shop?.category?.length > 3 && (
                        <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg">
                          +{shop.category.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={`/admin/shops/edit/${shop._id}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center shadow-md"
                    >
                      <PencilAltIcon className="h-5 w-5 mr-2" />
                      Edit
                    </Link>
                    <Link
                      to={`/admin/shops/products/${shop._id}`}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center shadow-md"
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      View
                    </Link>
                    <button
                      onClick={() => handleToggleBan(shop._id, shop.shopName)}
                      className={`py-3 px-4 rounded-xl font-semibold transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center shadow-md ${
                        shop.isBanned
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                          : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                      }`}
                    >
                      <BanIcon className="h-5 w-5 mr-2" />
                      {shop.isBanned ? "Unban" : "Ban"}
                    </button>
                    <button
                      onClick={() => handleDelete(shop._id, shop.shopName)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center shadow-md"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
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
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 max-w-md text-center">
              <div className="h-24 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No shops found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchKeyword.trim()
                  ? "Try a different search term or clear the search"
                  : "No shops have been registered yet"}
              </p>
              {searchKeyword.trim() && (
                <button
                  onClick={() => {
                    dispatch(setSearchKeyword(""));
                    dispatch(fetchShops());
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Clear Search & Show All
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}