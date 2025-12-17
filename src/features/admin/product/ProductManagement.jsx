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
  ShoppingBagIcon,
  AdjustmentsIcon,
} from "@heroicons/react/outline";

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

  const clearSearch = () => {
    dispatch(setSearchKeyword(""));
    dispatch(fetchShops());
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
        {/* Header Section - Single Row */}
        <div className="mb-6 md:mb-8">
          {/* Heading Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Shop Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage all registered shops and their status
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-lg font-medium">
                Total: {stats.total}
              </div>
            </div>
          </div>

          {/* Search and Status Row - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Section - Left Column */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Search Shops
                  </h2>
                </div>
                <AdjustmentsIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Search by shop name, email, or mobile number..."
                    value={searchKeyword}
                    onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
                    onKeyPress={handleKeyPress}
                    className="block w-full pl-4 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {searchKeyword && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center whitespace-nowrap"
                >
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
              
              {/* Search Info */}
              <div className="mt-4 flex flex-wrap items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {searchKeyword 
                    ? `Search results: ${filteredShops.length} shops found`
                    : `Showing ${filteredShops.length} of ${shops.length} shops`
                  }
                </span>
                {searchKeyword && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    Clear search
                  </button>
                )}
              </div>
            </div>

            {/* Status Section - Right Column */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BanIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Status Overview
                  </h2>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Updated just now
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Active Shops */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Active Shops
                      </p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                        {stats.active}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="flex-1 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: stats.total > 0 ? `${(stats.active / stats.total) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>

                {/* Banned Shops */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Banned Shops
                      </p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-200 mt-1">
                        {stats.banned}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <BanIcon className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="flex-1 h-2 bg-red-200 dark:bg-red-800 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: stats.total > 0 ? `${(stats.banned / stats.total) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-red-700 dark:text-red-400">
                      {stats.total > 0 ? Math.round((stats.banned / stats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Quick Stats
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Active ({stats.active})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Banned ({stats.banned})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <>
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  All Shops ({filteredShops.length})
                </h2>
                {searchKeyword && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search results for: "{searchKeyword}"
                  </div>
                )}
              </div>
            </div>

            {/* Shops Grid */}
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
          </>
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
                  onClick={clearSearch}
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