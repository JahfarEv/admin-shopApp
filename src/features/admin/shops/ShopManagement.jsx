// import React, { useState, useEffect } from 'react';
// import AdminLayout from '../../../components/layout/AdminLayout';
// import { 
//   SearchIcon as MagnifyingGlassIcon, 
//   FilterIcon as FunnelIcon,
//   TrashIcon,
//   XIcon as XMarkIcon,
//   CheckIcon,
//   BanIcon
// } from "@heroicons/react/outline";

// export default function ShopManagement() {
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [searchKeyword, setSearchKeyword] = useState('');

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
//       } catch (err) {
//         console.error('Error fetching shops:', err);
//         setError('Unable to load shops.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchShops();
//   }, []);

//   const handleSearch = async () => {
//     if (!searchKeyword.trim()) return;
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/search-shop/${searchKeyword}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await res.json();
//       setShops(data.shops || []);
//       setError('');
//     } catch (err) {
//       console.error('Search failed:', err);
//       setError('Search failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleBan = async (shopId) => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/change-shop-ban-status/${shopId}`,
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error('Failed to toggle ban status');

//       const refetch = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallshops`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const freshData = await refetch.json();
//       setShops(freshData || []);
//     } catch (err) {
//       console.error('Toggle ban failed:', err);
//       setError('Toggle ban failed');
//     }
//   };

//   const openModal = (shop) => {
//     setSelectedShop(shop);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setSelectedShop(null);
//     setShowModal(false);
//   };

//   const handleDelete = async () => {
//     if (!selectedShop) return;
//     try {
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/delete-shopById/${selectedShop._id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error('Failed to delete shop');

//       setShops((prev) => prev.filter((s) => s._id !== selectedShop._id));
//       closeModal();
//     } catch (err) {
//       console.error('Error deleting shop:', err);
//       setError('Failed to delete shop');
//       closeModal();
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Management</h2>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
//           <div className="relative flex">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by shop name, email, mobile"
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

//         {/* Shops Table */}
//         {!loading && !error && (
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Shop Name
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {shops.map((shop) => (
//                     <tr key={shop._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                         {shop.shopName}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                         {Array.isArray(shop.category) ? shop.category.join(', ') : shop.category}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                         {[shop.state, shop.place, shop.locality, shop.pinCode || shop.pincode]
//                           .filter(Boolean)
//                           .join(', ')}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           onClick={() => handleToggleBan(shop._id)}
//                           className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
//                             shop.isBanned
//                               ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
//                               : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
//                           }`}
//                         >
//                           {shop.isBanned ? (
//                             <>
//                               <BanIcon className="h-3 w-3 mr-1" />
//                               Banned
//                             </>
//                           ) : (
//                             <>
//                               <CheckIcon className="h-3 w-3 mr-1" />
//                               Active
//                             </>
//                           )}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => openModal(shop)}
//                           className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center justify-end w-full"
//                         >
//                           <TrashIcon className="h-5 w-5 mr-1" />
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//               <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                 <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
//               </div>
//               <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//               <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                 <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
//                       <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
//                     </div>
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                       <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
//                         Delete Shop
//                       </h3>
//                       <div className="mt-2">
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           Are you sure you want to delete shop <span className="font-semibold">{selectedShop?.shopName}</span>? This action cannot be undone.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="button"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
//                     onClick={handleDelete}
//                   >
//                     Delete
//                   </button>
//                   <button
//                     type="button"
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                     onClick={closeModal}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }


import React, { useState, useEffect } from 'react';
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
import { 
  SearchIcon as MagnifyingGlassIcon, 
  TrashIcon,
  CheckIcon,
  BanIcon
} from "@heroicons/react/outline";
import { toast } from 'react-toastify';

export default function ShopManagement() {
  const dispatch = useDispatch();
  const {
    shops,
    loading,
    error,
    searchKeyword: reduxSearchKeyword
  } = useSelector((state) => state.shops);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [localSearchKeyword, setLocalSearchKeyword] = useState('');

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = () => {
    if (!localSearchKeyword.trim()) {
      dispatch(fetchShops());
      return;
    }
    dispatch(searchShops(localSearchKeyword));
    dispatch(setSearchKeyword(localSearchKeyword));
  };

  const handleToggleBan = async (shopId) => {
    try {
      await dispatch(toggleShopBan(shopId)).unwrap();
      toast.success('Shop status updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openModal = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedShop(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedShop) return;
    try {
      await dispatch(deleteShop(selectedShop._id)).unwrap();
      toast.success('Shop deleted successfully');
      closeModal();
    } catch (err) {
      toast.error(err.message);
      closeModal();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Management</h2>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by shop name, email, mobile"
              value={localSearchKeyword}
              onChange={(e) => setLocalSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Shops Table */}
        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Shop Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {shops.map((shop) => (
                    <tr key={shop._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {shop.shopName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {Array.isArray(shop.category) ? shop.category.join(', ') : shop.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {[shop.state, shop.place, shop.locality, shop.pinCode || shop.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleBan(shop._id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                            shop.isBanned
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          }`}
                        >
                          {shop.isBanned ? (
                            <>
                              <BanIcon className="h-3 w-3 mr-1" />
                              Banned
                            </>
                          ) : (
                            <>
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Active
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(shop)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center justify-end w-full"
                        >
                          <TrashIcon className="h-5 w-5 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Delete Shop
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete shop <span className="font-semibold">{selectedShop?.shopName}</span>? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}