// import React, { useState, useEffect } from 'react';
// import AdminLayout from '../../../components/layout/AdminLayout';
// import { 
//   SearchIcon as MagnifyingGlassIcon, 
//   FilterIcon as FunnelIcon, 
//   TrashIcon, 
//   XIcon as XMarkIcon, 
//   CheckIcon 
// } from "@heroicons/react/outline";
// export default function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchKeyword, setSearchKeyword] = useState('');

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const token = localStorage.getItem('adminToken');
//         const res = await fetch(
//           `https://shop-app-backend-k0a2.onrender.com/adminDashboard/getalluser`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error('Failed to fetch users');
//         const data = await res.json();
//         setUsers(data.data || []);
//       } catch (err) {
//         console.error('Error fetching users:', err);
//         setError('Unable to load users.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchUsers();
//   }, []);

//   const handleSearch = async () => {
//     if (!searchKeyword.trim()) return;
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/search-users/${searchKeyword}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await res.json();
//       setUsers(data.users || []);
//       setFilter('all');
//       setError('');
//     } catch (err) {
//       console.error('Search failed:', err);
//       setError('Search failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (user) => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setSelectedUser(null);
//     setShowModal(false);
//   };

//   const handleDelete = async () => {
//     if (!selectedUser) return;
//     try {
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/deleteuser/${selectedUser._id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error('Failed to delete user');

//       setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
//       closeModal();
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setError('Failed to delete user');
//       closeModal();
//     }
//   };

//   const filteredUsers = users.filter((user) => {
//     if (filter === 'subscribed') return Boolean(user.subscriptionId);
//     if (filter === 'non') return !user.subscriptionId;
//     return true;
//   });

//   return (
//     <AdminLayout>
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or mobile"
//                 value={searchKeyword}
//                 onChange={(e) => setSearchKeyword(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
            
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
//             >
//               <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
//               Search
//             </button>
//           </div>

//           {/* Filter Buttons */}
//           <div className="flex flex-wrap gap-2 mt-4">
//             <button
//               className={`px-4 py-2 rounded-lg flex items-center ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
//               onClick={() => setFilter('all')}
//             >
//               <FunnelIcon className="h-4 w-4 mr-2" />
//               All Users
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg flex items-center ${filter === 'subscribed' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
//               onClick={() => setFilter('subscribed')}
//             >
//               <CheckIcon className="h-4 w-4 mr-2" />
//               Subscribed
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg flex items-center ${filter === 'non' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
//               onClick={() => setFilter('non')}
//             >
//               <XMarkIcon className="h-4 w-4 mr-2" />
//               Non-Subscribed
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

//         {/* Users Table */}
//         {!loading && !error && (
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
//               <div className="max-h-[calc(91vh-300px)] overflow-y-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Mobile
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Subscription
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                         {user.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                         {user.mobileNumber}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                         {[user.state, user.place, user.locality, user.pincode]
//                           .filter(Boolean)
//                           .join(', ')}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscriptionId ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
//                           {user.subscriptionId ? 'Active' : 'None'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => openModal(user)}
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
//                         Delete User
//                       </h3>
//                       <div className="mt-2">
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           Are you sure you want to delete user <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
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
  fetchUsers, 
  searchUsers, 
  deleteUser, 
  setFilter, 
  setSearchKeyword 
} from '../../store/user/userSlice';
import AdminLayout from '../../../components/layout/AdminLayout';
import { 
  SearchIcon as MagnifyingGlassIcon, 
  FilterIcon as FunnelIcon, 
  TrashIcon, 
  XIcon as XMarkIcon, 
  CheckIcon 
} from "@heroicons/react/outline";

export default function UserManagement() {
  const dispatch = useDispatch();
  const {
    users,
    filteredUsers,
    loading,
    error,
    filter,
    searchKeyword: reduxSearchKeyword
  } = useSelector((state) => state.users);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [localSearchKeyword, setLocalSearchKeyword] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = () => {
    if (!localSearchKeyword.trim()) return;
    dispatch(searchUsers(localSearchKeyword));
    dispatch(setSearchKeyword(localSearchKeyword));
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    dispatch(deleteUser(selectedUser._id));
    closeModal();
  };

  return (
    <AdminLayout>
      <div className="p-6 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or mobile"
                value={localSearchKeyword}
                onChange={(e) => setLocalSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
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

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="max-h-[calc(91vh-300px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.mobileNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {[user.state, user.place, user.locality, user.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscriptionId ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                          {user.subscriptionId ? 'Active' : 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(user)}
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
                        Delete User
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete user <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
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