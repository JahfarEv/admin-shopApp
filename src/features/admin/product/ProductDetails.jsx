// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import AdminLayout from '../../../components/layout/AdminLayout';
// import { Search } from 'lucide-react';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');

//     fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/get-product-by-shopId/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => setProducts(data.products || []))
//       .catch(console.error);
//   }, [id]);

//   const openDeleteModal = (productId) => {
//     setProductToDelete(productId);
//     setShowModal(true);
//   };

//   const closeDeleteModal = () => {
//     setShowModal(false);
//     setProductToDelete(null);
//   };

//   const confirmDelete = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');

//       const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/delete-product/${productToDelete}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (res.ok) {
//         setProducts(prev => prev.filter(p => p._id !== productToDelete));
//         closeDeleteModal();
//       } else {
//         console.error('Failed to delete product');
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error);
//     }
//   };

//   const handleSearch = () => {
//     setSearchQuery(searchTerm.trim());
//   };

//   const filteredProducts = products.filter(product =>
//     product.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <AdminLayout>
//       <div className="p-6 max-w-7xl mx-auto">
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

//         {/* Products Grid */}
//         {filteredProducts.length === 0 ? (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">No matching products found.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredProducts.map(product => (
//               <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={product.productImage}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
//                   <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
//                   <div className="text-blue-400 font-bold mb-4">₹{product.price}</div>
//                   <button
//                     onClick={() => openDeleteModal(product._id)}
//                     className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
//                   >
//                     DELETE PRODUCT
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
//               <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
//               <p className="text-gray-300 mb-6">
//                 Are you sure you want to permanently delete this product? This action cannot be undone.
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

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByShopId, deleteProduct } from '../../store/products/productSlice';
import AdminLayout from '../../../components/layout/AdminLayout';
import { Search } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProductsByShopId(id));
  }, [id, dispatch]);

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteProduct(productToDelete)).unwrap();
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <p className="text-gray-200">Manage shop's products</p>
          <Link 
            to="/admin/products" 
            className="inline-flex items-center mt-10 text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-400 text-lg">Error loading products</p>
          </div>
        )}

        {/* Products Grid */}
        {status === 'succeeded' && filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400 text-lg">No matching products found.</p>
          </div>
        ) : (
          status === 'succeeded' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.productImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="text-blue-400 font-bold mb-4">₹{product.price}</div>
                    <button
                      onClick={() => openDeleteModal(product._id)}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
                    >
                      DELETE PRODUCT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={closeDeleteModal}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
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