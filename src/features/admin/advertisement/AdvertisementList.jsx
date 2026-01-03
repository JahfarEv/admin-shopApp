import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../components/layout/AdminLayout";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Calendar,
  Eye,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    image: null,
    imagePreview: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Fetch advertisements
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://api.poketstor.com/adminDashboard/advertisement"
      );

      if (res.ok) {
        const data = await res.json();
        // Handle different response structures
        if (data.advertisements) {
          setAdvertisements(data.advertisements);
        } else if (data.data) {
          setAdvertisements(data.data);
        } else if (Array.isArray(data)) {
          setAdvertisements(data);
        } else {
          setAdvertisements([]);
        }
      } else {
        setMessage("❌ Failed to fetch advertisements");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      setMessage("❌ Something went wrong while fetching advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // Delete advertisement
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(
        `https://api.poketstor.com/adminDashboard/advertisements/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setMessage("✅ Advertisement deleted successfully!");
        fetchAdvertisements();
      } else {
        const data = await res.json();
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      setMessage("❌ Something went wrong while deleting");
    }
  };

  // Start editing
  const startEdit = (ad) => {
    setEditingAd(ad);
    setEditForm({
      title: ad.title,
      image: null,
      imagePreview: ad.imageUrl || ad.image || null,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingAd(null);
    setEditForm({
      title: "",
      image: null,
      imagePreview: null,
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change in edit form
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update advertisement
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.title) {
      setMessage("❌ Please provide a title");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const res = await fetch(
        `https://api.poketstor.com/adminDashboard/advertisements/${editingAd._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Advertisement updated successfully!");
        setEditingAd(null);
        setEditForm({
          title: "",
          image: null,
          imagePreview: null,
        });
        fetchAdvertisements();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating ad:", error);
      setMessage("❌ Something went wrong while updating");
    }
  };

  // Search and filter functions
  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter advertisements based on search query
  const filteredAds = advertisements.filter((ad) =>
    ad.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort advertisements
  const sortedAds = [...filteredAds].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "createdAt") {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    } else if (sortField === "title") {
      aValue = a.title?.toLowerCase() || "";
      bValue = b.title?.toLowerCase() || "";
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = sortedAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAds.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Advertisement Management
                </h1>
                <p className="text-gray-300">
                  Manage all advertisements in a tabular view
                </p>
              </div>
            </div>

            <Link
              to="/admin/advertisements/create"
              className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Ads</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {advertisements.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Showing</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {currentAds.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Search Results</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {filteredAds.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Filter className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.includes("✅")
                ? "bg-green-900/20 border-green-800 text-green-400"
                : "bg-red-900/20 border-red-800 text-red-400"
            }`}
          >
            <div className="flex items-center">
              {message.includes("✅") ? (
                <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="text-xs text-white">✓</span>
                </div>
              ) : (
                <AlertCircle className="h-5 w-5 mr-3" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search advertisements by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-xl transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-gray-400 text-lg">Loading advertisements...</p>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Advertisements ({filteredAds.length})
                  </h2>
                  <p className="text-sm text-gray-400">
                    {searchQuery
                      ? `Search results for: "${searchQuery}"`
                      : "All advertisements"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="text-sm text-gray-400 mr-2">Show:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        {sortField === "title" && (
                          <span className="ml-1 text-purple-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Image URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created At
                        {sortField === "createdAt" && (
                          <span className="ml-1 text-purple-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentAds.map((ad) => (
                    <tr
                      key={ad._id || ad.id}
                      className="hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-16 w-16">
                          {ad.imageUrl || ad.image ? (
                            <img
                              src={ad.imageUrl || ad.image}
                              alt={ad.title}
                              className="h-16 w-16 rounded-lg object-cover border border-gray-700"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/image-placeholder.png";
                                e.currentTarget.classList.add("bg-gray-800");
                                e.currentTarget.classList.add("p-2");
                              }}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {ad.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 max-w-xs truncate">
                          {ad.imageUrl || ad.image || "No image URL"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatDate(ad.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => startEdit(ad)}
                            title="Edit Advertisement"
                            className="p-2 bg-blue-900/30 text-blue-400 hover:bg-blue-800/40 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(ad._id || ad.id, ad.title)
                            }
                            title="Delete Advertisement"
                            className="p-2 bg-red-900/30 text-red-400 hover:bg-red-800/40 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-purple-900/20 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No advertisements found
                </h3>
                <p className="text-gray-400 mb-4 max-w-sm mx-auto">
                  {searchQuery
                    ? "No advertisements match your search criteria. Try a different search term."
                    : "No advertisements have been created yet."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear Search
                  </button>
                  <Link
                    to="/admin/advertisements/create"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create First Advertisement
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredAds.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm text-gray-400">
                    Showing{" "}
                    <span className="font-medium text-white">
                      {indexOfFirstItem + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-white">
                      {Math.min(indexOfLastItem, filteredAds.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {filteredAds.length}
                    </span>{" "}
                    advertisements
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-purple-600 text-white"
                                  : "text-gray-300 hover:bg-gray-800"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Form Modal */}
        {editingAd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <Edit className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Edit Advertisement
                  </h2>
                </div>
                <button
                  onClick={cancelEdit}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Advertisement Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter a compelling title..."
                    className="w-full bg-gray-900 border-2 border-gray-700 p-4 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Advertisement Image
                  </label>

                  {/* Current Image Preview */}
                  <div className="space-y-4">
                    {/* Current Image */}
                    {(editingAd.imageUrl || editingAd.image) &&
                      !editForm.imagePreview && (
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-2">
                            Current Image:
                          </p>
                          <div className="relative inline-block">
                            <img
                              src={editingAd.imageUrl || editingAd.image}
                              alt="Current"
                              className="max-w-full h-48 object-cover rounded-lg shadow-md border-2 border-gray-700"
                            />
                          </div>
                        </div>
                      )}

                    {/* New Image Preview */}
                    {editForm.imagePreview && (
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">
                          New Image Preview:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={editForm.imagePreview}
                            alt="Preview"
                            className="max-w-full h-48 object-cover rounded-lg shadow-md border-2 border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditForm((prev) => ({
                                ...prev,
                                imagePreview: null,
                                image: null,
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    {/* File Input */}
                    <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors duration-200 bg-gray-900/50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="edit-file-input"
                        onChange={handleEditImageChange}
                      />
                      <label
                        htmlFor="edit-file-input"
                        className="cursor-pointer block"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-500 mb-3" />
                          <span className="text-gray-400 font-medium">
                            {editForm.image
                              ? "Change Image"
                              : "Click to upload new image (optional)"}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            PNG, JPG, JPEG up to 10MB
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-700 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Update Advertisement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdvertisementList;
