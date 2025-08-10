// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AdminLayout from '../../../components/layout/AdminLayout';
// import { SearchIcon as MagnifyingGlassIcon } from "@heroicons/react/outline";

// export default function ProductManagement() {
//   const [shops, setShops] = useState([]);
//   const [filteredShops, setFilteredShops] = useState([]);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchShops() {
//       try {
//         const token = localStorage.getItem('adminToken');
//         const res = await fetch(
//           `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallshops`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error('Failed to fetch shops');
//         const data = await res.json();
//         setShops(data || []);
//         setFilteredShops(data || []);
//       } catch (err) {
//         console.error('Error fetching shops:', err);
//         setError('Unable to load shops');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShops();
//   }, []);

//   const handleSearch = () => {
//     const keyword = searchKeyword.toLowerCase().trim();
//     if (!keyword) {
//       setFilteredShops(shops);
//       return;
//     }

//     const filtered = shops.filter((shop) => {
//       return (
//         shop.shopName?.toLowerCase().includes(keyword) ||
//         shop.category?.toString().toLowerCase().includes(keyword) ||
//         shop.email?.toLowerCase().includes(keyword) ||
//         shop.mobile?.toString().includes(keyword)
//       );
//     });

//     setFilteredShops(filtered);
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Shops</h2>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
//           <div className="relative flex">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name, email, mobile"
//               value={searchKeyword}
//               onChange={(e) => setSearchKeyword(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//             <button
//               onClick={handleSearch}
//               className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
//             >
//               <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Loading and Error States */}
//         {loading && (
//           <div className="flex justify-center items-center p-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {/* Shops Grid */}
//         {!loading && !error && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredShops.map((shop) => (
//               <Link
//                 key={shop._id}
//                 to={`/admin/shops/products/${shop._id}`}
//                 className="group"
//               >
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
//                   {/* Shop Image */}
//                   <div className="h-48 overflow-hidden">
//                     <img
//                       src={shop.headerImage || 'https://via.placeholder.com/300x200?text=Shop+Image'}
//                       alt={shop.shopName}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/300x200?text=Shop+Image';
//                       }}
//                     />
//                   </div>

//                   {/* Shop Info */}
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
//                       {shop.shopName}
//                     </h3>
                    
//                     <div className="space-y-2">
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         <span className="font-medium text-gray-800 dark:text-gray-200">Category:</span>{' '}
//                         {Array.isArray(shop.category)
//                           ? shop.category.join(', ')
//                           : shop.category || 'N/A'}
//                       </p>
                      
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         <span className="font-medium text-gray-800 dark:text-gray-200">Location:</span>{' '}
//                         {[shop.state, shop.place, shop.locality, shop.pinCode || shop.pincode]
//                           .filter(Boolean)
//                           .join(', ') || 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && !error && filteredShops.length === 0 && (
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
//             <div className="text-gray-500 dark:text-gray-400">
//               <svg
//                 className="mx-auto h-12 w-12"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1"
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 ></path>
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
//                 No shops found
//               </h3>
//               <p className="mt-1 text-gray-500 dark:text-gray-400">
//                 {searchKeyword.trim() ? 'Try a different search term' : 'No shops available'}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }



import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchShops, 
  searchShops, 
  toggleShopBan, 
  deleteShop,
  setSearchKeyword,
  clearError
} from '../../../features/store/shop/shopSlice';
import AdminLayout from '../../../components/layout/AdminLayout';
import { SearchIcon as MagnifyingGlassIcon } from "@heroicons/react/outline";

export default function ProductManagement() {
  const dispatch = useDispatch();
  const {
    items: shops,
    filteredItems: filteredShops,
    status,
    error,
    searchKeyword,
  } = useSelector((state) => state.shops);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(filterShops());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Shops</h2>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, mobile"
              value={searchKeyword}
              onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
              onKeyPress={handleKeyPress}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {status === 'loading' && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Shops Grid */}
        {status === 'succeeded' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop._id}
                to={`/admin/shops/products/${shop._id}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                  {/* Shop Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={shop.headerImage || 'https://via.placeholder.com/300x200?text=Shop+Image'}
                      alt={shop.shopName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Shop+Image';
                      }}
                    />
                  </div>

                  {/* Shop Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {shop.shopName}
                    </h3>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-gray-200">Category:</span>{' '}
                        {Array.isArray(shop.category)
                          ? shop.category.join(', ')
                          : shop.category || 'N/A'}
                      </p>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-gray-800 dark:text-gray-200">Location:</span>{' '}
                        {[shop.state, shop.place, shop.locality, shop.pinCode || shop.pincode]
                          .filter(Boolean)
                          .join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {status === 'succeeded' && filteredShops.length === 0 && (
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
                {searchKeyword.trim() ? 'Try a different search term' : 'No shops available'}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}