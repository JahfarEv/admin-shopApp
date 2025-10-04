// import React, { useState, useEffect } from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";

// const AdvertisementList = () => {
//   const [advertisements, setAdvertisements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [editingAd, setEditingAd] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     image: null,
//     imagePreview: null
//   });

//   // Fetch advertisements
//   const fetchAdvertisements = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:8000/adminDashboard/advertisement");
      
//       if (res.ok) {
//         const data = await res.json();
//         setAdvertisements(data.advertisements || []);
//       } else {
//         setMessage("❌ Failed to fetch advertisements");
//       }
//     } catch (error) {
//       console.error("Error fetching ads:", error);
//       setMessage("❌ Something went wrong while fetching advertisements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAdvertisements();
//   }, []);

//   // Delete advertisement
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this advertisement?")) {
//       return;
//     }

//     try {
//       const res = await fetch(`https://api.poketstor.com/adminDashboard/advertisement/${id}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         setMessage("✅ Advertisement deleted successfully!");
//         fetchAdvertisements(); // Refresh the list
//       } else {
//         const data = await res.json();
//         setMessage(`❌ Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error("Error deleting ad:", error);
//       setMessage("❌ Something went wrong while deleting");
//     }
//   };

//   // Start editing
//   const startEdit = (ad) => {
//     setEditingAd(ad);
//     setEditForm({
//       title: ad.title,
//       image: null,
//       imagePreview: ad.imageUrl || null
//     });
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingAd(null);
//     setEditForm({
//       title: "",
//       image: null,
//       imagePreview: null
//     });
//   };

//   // Handle edit form changes
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle image change in edit form
//   const handleEditImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setEditForm(prev => ({
//         ...prev,
//         image: file
//       }));
      
//       // Create image preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEditForm(prev => ({
//           ...prev,
//           imagePreview: reader.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Update advertisement
//   const handleUpdate = async (e) => {
//     e.preventDefault();
    
//     if (!editForm.title) {
//       setMessage("❌ Please provide a title");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("title", editForm.title);
//       if (editForm.image) {
//         formData.append("image", editForm.image);
//       }

//       const res = await fetch(`https://api.poketstor.com/adminDashboard/advertisement/${editingAd._id}`, {
//         method: "PUT",
//         body: formData,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("✅ Advertisement updated successfully!");
//         setEditingAd(null);
//         setEditForm({
//           title: "",
//           image: null,
//           imagePreview: null
//         });
//         fetchAdvertisements(); // Refresh the list
//       } else {
//         setMessage(`❌ Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error("Error updating ad:", error);
//       setMessage("❌ Something went wrong while updating");
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="min-h-screen py-8 px-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header Section */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-200 mb-2">
//               Manage Advertisements
//             </h1>
//             <p className="text-gray-300">
//               View, edit, and delete your advertisements
//             </p>
//           </div>

//           {/* Message Display */}
//           {message && (
//             <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
//               message.includes("✅") 
//                 ? "bg-green-100 text-green-700 border border-green-200" 
//                 : "bg-red-100 text-red-700 border border-red-200"
//             }`}>
//               {message}
//             </div>
//           )}

//           {/* Edit Form Modal */}
//           {editingAd && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                   Edit Advertisement
//                 </h2>
                
//                 <form onSubmit={handleUpdate} className="space-y-6">
//                   {/* Title Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Advertisement Title *
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       placeholder="Enter a compelling title..."
//                       className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//                       value={editForm.title}
//                       onChange={handleEditChange}
//                     />
//                   </div>

//                   {/* Image Upload Section */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Advertisement Image
//                     </label>
                    
//                     {/* Image Preview */}
//                     {editForm.imagePreview && (
//                       <div className="mb-4 text-center">
//                         <div className="relative inline-block">
//                           <img
//                             src={editForm.imagePreview}
//                             alt="Preview"
//                             className="max-w-full h-48 object-cover rounded-lg shadow-md border-2 border-gray-200"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setEditForm(prev => ({
//                                 ...prev,
//                                 imagePreview: null,
//                                 image: null
//                               }));
//                             }}
//                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* File Input */}
//                     <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         id="edit-file-input"
//                         onChange={handleEditImageChange}
//                       />
//                       <label
//                         htmlFor="edit-file-input"
//                         className="cursor-pointer block"
//                       >
//                         <div className="flex flex-col items-center justify-center">
//                           <svg
//                             className="w-12 h-12 text-gray-400 mb-3"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                             />
//                           </svg>
//                           <span className="text-gray-600 font-medium">
//                             {editForm.image ? "Change Image" : "Click to upload new image (optional)"}
//                           </span>
//                           <span className="text-sm text-gray-500 mt-1">
//                             PNG, JPG, JPEG up to 10MB
//                           </span>
//                         </div>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-4 pt-4">
//                     <button
//                       type="button"
//                       onClick={cancelEdit}
//                       className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
//                     >
//                       Update Advertisement
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* Advertisements Grid */}
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="text-gray-300 mt-4">Loading advertisements...</p>
//             </div>
//           ) : advertisements.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">No Advertisements Found</h3>
//               <p className="text-gray-500">Create your first advertisement to get started.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {advertisements.map((ad) => (
//                 <div key={ad._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//                   {/* Advertisement Image */}
//                   <div className="h-48 bg-gray-200 overflow-hidden">
//                     {ad.imageUrl ? (
//                       <img
//                         src={ad.image}
//                         alt={ad.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                         <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Advertisement Details */}
//                   <div className="p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//                       {ad.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 mb-4">
//                       Created: {new Date(ad.createdAt).toLocaleDateString()}
//                     </p>
                    
//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => startEdit(ad)}
//                         className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(ad._id)}
//                         className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdvertisementList;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Add this import
import AdminLayout from "../../../components/layout/AdminLayout";

const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    image: null,
    imagePreview: null
  });

  // Fetch advertisements
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.poketstor.com/adminDashboard/advertisement");
      
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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) {
      return;
    }

    try {
      const res = await fetch(`https://api.poketstor.com/adminDashboard/advertisements/${id}`, {
        method: "DELETE",
      });

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
      imagePreview: ad.imageUrl || ad.image || null
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingAd(null);
    setEditForm({
      title: "",
      image: null,
      imagePreview: null
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image change in edit form
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          imagePreview: reader.result
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

      const res = await fetch(`https://api.poketstor.com/adminDashboard/advertisements/${editingAd._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Advertisement updated successfully!");
        setEditingAd(null);
        setEditForm({
          title: "",
          image: null,
          imagePreview: null
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

  return (
    <AdminLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-200 mb-2">
                Manage Advertisements
              </h1>
              <p className="text-gray-300">
                View, edit, and delete your advertisements
              </p>
            </div>
            
            {/* Create Advertisement Button */}
            <Link
              to="/admin/advertisements/create"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Advertisement
            </Link>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
              message.includes("✅") 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {/* Edit Form Modal */}
          {editingAd && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Advertisement
                  </h2>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advertisement Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter a compelling title..."
                      className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      value={editForm.title}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advertisement Image
                    </label>
                    
                    {/* Current Image */}
                    {(editingAd.imageUrl || editingAd.image) && !editForm.imagePreview && (
                      <div className="mb-4 text-center">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <img
                          src={editingAd.imageUrl || editingAd.image}
                          alt="Current"
                          className="max-w-full h-48 object-cover rounded-lg shadow-md border-2 border-gray-200 mx-auto"
                        />
                      </div>
                    )}
                    
                    {/* New Image Preview */}
                    {editForm.imagePreview && (
                      <div className="mb-4 text-center">
                        <div className="relative inline-block">
                          <img
                            src={editForm.imagePreview}
                            alt="Preview"
                            className="max-w-full h-48 object-cover rounded-lg shadow-md border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditForm(prev => ({
                                ...prev,
                                imagePreview: null,
                                image: null
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
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
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
                          <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-gray-600 font-medium">
                            {editForm.image ? "Change Image" : "Click to upload new image (optional)"}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            PNG, JPG, JPEG up to 10MB
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
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

          {/* Advertisements Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading advertisements...</p>
            </div>
          ) : advertisements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Advertisements Found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first advertisement.</p>
              <Link
                to="/admin/advertisements/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Advertisement
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements.map((ad) => (
                <div key={ad._id || ad.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {/* Advertisement Image */}
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {ad.imageUrl || ad.image ? (
                      <img
                        src={ad.imageUrl || ad.image}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Advertisement Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {ad.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Created: {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(ad)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id || ad.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdvertisementList;