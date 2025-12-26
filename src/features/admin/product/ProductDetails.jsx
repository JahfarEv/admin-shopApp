// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProductsByShopId,
//   deleteProduct,
// } from "../../store/products/productSlice";
// import AdminLayout from "../../../components/layout/AdminLayout";
// import { Search } from "lucide-react";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { items: products, status } = useSelector((state) => state.products);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchProductsByShopId(id));
//   }, [id, dispatch]);

//   const openDeleteModal = (productId) => {
//     setProductToDelete(productId);
//     setShowModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowModal(false);
//     setProductToDelete(null);
//   };

//   const confirmDelete = async () => {
//     if (productToDelete) {
//       try {
//         await dispatch(deleteProduct(productToDelete)).unwrap();
//         closeDeleteModal();
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   const handleSearch = () => {
//     setSearchQuery(searchTerm.trim());
//   };

//   const filteredProducts = products.filter((product) =>
//     product.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <AdminLayout>
//       <div className="p-6 ">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-white">Product Management</h2>
//           <p className="text-gray-200">Manage shop's products</p>
//           <Link
//             to="/admin/products"
//             className="inline-flex items-center mt-10 text-blue-400 hover:text-blue-300 transition-colors"
//           >
//             ← Back
//           </Link>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by product name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Loading State */}
//         {status === "loading" && (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">Loading products...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {status === "failed" && (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-red-400 text-lg">
//               No products available for this shop.
//             </p>
//           </div>
//         )}

//         {/* Products Grid */}
//         {status === "succeeded" && filteredProducts.length === 0 ? (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">No matching products found.</p>
//           </div>
//         ) : (
//           status === "succeeded" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
//                 >
//                   <div className="h-48 overflow-hidden">
//                     <img
//                       src={product.productImage}
//                       alt={product.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-white mb-2">
//                       {product.name}
//                     </h3>
//                     <p className="text-gray-300 text-sm mb-3 line-clamp-2">
//                       {product.description}
//                     </p>
//                     <div className="text-blue-400 font-bold mb-4">
//                       ₹{product.price}
//                     </div>
//                     <button
//                       onClick={() => openDeleteModal(product._id)}
//                       className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
//                     >
//                       DELETE PRODUCT
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )
//         )}

//         {/* Delete Confirmation Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
//               <h2 className="text-xl font-bold text-white mb-4">
//                 Confirm Deletion
//               </h2>
//               <p className="text-gray-300 mb-6">
//                 Are you sure you want to permanently delete this product? This
//                 action cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   onClick={closeDeleteModal}
//                   className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
//                 >
//                   Yes, Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default ProductDetails;






import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsByShopId,
  deleteProduct,
} from "../../store/products/productSlice";
import AdminLayout from "../../../components/layout/AdminLayout";
import { 
  Search, 
  Trash2, 
  Eye, 
  Edit, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  Filter
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    dispatch(fetchProductsByShopId(id));
  }, [id, dispatch]);

  const openDeleteModal = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (productToDelete?.id) {
      try {
        await dispatch(deleteProduct(productToDelete.id)).unwrap();
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "price") {
      aValue = parseFloat(a.price) || 0;
      bValue = parseFloat(b.price) || 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
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
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Product Management
                </h1>
                <p className="text-gray-300">
                  Manage shop's products in a tabular view
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Products
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Showing</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {currentProducts.length}
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
                    {filteredProducts.length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Filter className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  placeholder="Search by product name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
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
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800/50 rounded-2xl p-8">
            <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Error Loading Products
            </h3>
            <p className="text-gray-400 text-center mb-4">
              Unable to load products for this shop. Please try again.
            </p>
          </div>
        )}

        {/* Table Section */}
        {status === "succeeded" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Products ({filteredProducts.length})
                  </h2>
                  <p className="text-sm text-gray-400">
                    {searchQuery ? `Search results for: "${searchQuery}"` : "All products"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="text-sm text-gray-400 mr-2">
                      Show:
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === "name" && (
                          <span className="ml-1 text-blue-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        {sortField === "price" && (
                          <span className="ml-1 text-blue-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={product.productImage || "/images/product-placeholder.png"}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-700"
                            onError={(e) => {
                              e.currentTarget.src = "/images/product-placeholder.png";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 max-w-xs">
                          {truncateText(product.description, 60)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-blue-400">
                          ₹{parseFloat(product.price).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-900/30 text-purple-300">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            title="View Product"
                            className="p-2 bg-blue-900/30 text-blue-400 hover:bg-blue-800/40 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            title="Edit Product"
                            className="p-2 bg-green-900/30 text-green-400 hover:bg-green-800/40 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product._id, product.name)}
                            title="Delete Product"
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
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-900/20 rounded-full mb-4">
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-4 max-w-sm mx-auto">
                  {searchQuery
                    ? "No products match your search criteria. Try a different search term."
                    : "This shop doesn't have any products yet."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium text-white">
                      {Math.min(indexOfLastItem, filteredProducts.length)}
                    </span>{" "}
                    of <span className="font-medium text-white">{filteredProducts.length}</span> products
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
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-800"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
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

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Delete Product
                </h2>
              </div>
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  "{productToDelete?.name}"
                </span>
                ?
              </p>
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone. All product data will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductDetails;