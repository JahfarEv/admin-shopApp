// import { useEffect, useState } from "react";
// import AdminLayout from "../../../components/layout/AdminLayout";

// const API_BASE = "https://api.poketstor.com";

// export default function AdminShopSubscriptions() {
//   const [shops, setShops] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState({});
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("adminToken"); // adjust if needed

//   // 🔹 Fetch shops
//   const fetchShops = async () => {
//     const res = await fetch(`${API_BASE}/adminDashboard/getallshops`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const data = await res.json();
//     setShops(data);
//   };

//   // 🔹 Fetch plans
//   const fetchPlans = async () => {
//     const res = await fetch(`${API_BASE}/api/subscription-plans/getallplan`);
//     const data = await res.json();
//     setPlans(data.plans || []);
//   };

//   useEffect(() => {
//     fetchShops();
//     fetchPlans();
//   }, []);

//   // 🔹 Activate subscription
//   const activateSubscription = async (shopId) => {
//     const planId = selectedPlan[shopId];
//     if (!planId) {
//       alert("Please select a plan");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${API_BASE}/adminDashboard/start-without-payment`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ shopId, planId }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.message || "Failed");
//       } else {
//         alert("Subscription activated");
//         fetchShops(); // refresh
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPlanName = (planId) =>
//     plans.find((p) => p._id === planId)?.name || "—";

//   return (
//     <AdminLayout>
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-white">Shop Subscriptions</h1>

//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-200 rounded-lg">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3">Shop</th>
//               <th className="p-3">Place</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Plan</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {shops.map((shop) => {
//               const isActive = shop.subscription?.isActive;

//               return (
//                 <tr key={shop._id} className="border-t text-white">
//                   <td className="p-3 font-medium">{shop.shopName}</td>
//                   <td className="p-3">
//                     {shop.place}, {shop.state}
//                   </td>

//                   {/* STATUS */}
//                   <td className="p-3">
//                     {isActive ? (
//                       <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
//                         Active
//                       </span>
//                     ) : (
//                       <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
//                         Inactive
//                       </span>
//                     )}
//                   </td>

//                   {/* PLAN */}
//                   <td className="p-3">
//                     {isActive
//                       ? getPlanName(shop.subscription?.plan)
//                       : "—"}
//                   </td>

//                   {/* ACTION */}
//                   <td className="p-3">
//                     {isActive ? (
//                       <span className="text-gray-400 text-sm">
//                         Already Active
//                       </span>
//                     ) : (
//                       <div className="flex gap-2 items-center text-black ">
//                         <select
//                           className="border rounded px-2 py-1 text-sm bg-white"
//                           value={selectedPlan[shop._id] || ""}
//                           onChange={(e) =>
//                             setSelectedPlan((prev) => ({
//                               ...prev,
//                               [shop._id]: e.target.value,
//                             }))
//                           }
//                         >
//                           <option value="">Select Plan</option>
//                           {plans.map((plan) => (
//                             <option key={plan._id} value={plan._id}>
//                               {plan.name}
//                             </option>
//                           ))}
//                         </select>

//                         <button
//                           disabled={loading}
//                           onClick={() => activateSubscription(shop._id)}
//                           className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
//                         >
//                           Activate
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {shops.length === 0 && (
//           <p className="text-center text-gray-500 mt-6">
//             No shops found
//           </p>
//         )}
//       </div>
//     </div>
//     </AdminLayout>
//   );
  
// }

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import debounce from "lodash/debounce";

const API_BASE = "https://api.poketstor.com";

export default function AdminShopSubscriptions() {
  const [shops, setShops] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const token = localStorage.getItem("adminToken");

  // 🔹 Fetch shops (with optional mobile search)
  const fetchShops = async (mobile = "") => {
    try {
      setSearchError("");
      let url = `${API_BASE}/adminDashboard/getallshops`;
      if (mobile.trim()) {
        url += `?mobile=${encodeURIComponent(mobile)}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setShops(data || []);
      setIsTyping(false);
      
      // Show message if no results found
      if (mobile.trim() && data.length === 0) {
        setSearchError(`No shops found with mobile: "${mobile}"`);
      }
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      setSearchError("Failed to fetch shops. Please try again.");
      setShops([]);
      setIsTyping(false);
    }
  };

  // 🔹 Fetch plans
  const fetchPlans = async () => {
    const res = await fetch(`${API_BASE}/api/subscription-plans/getallplan`);
    const data = await res.json();
    setPlans(data.plans || []);
  };

  // 🔹 Create debounced search function
  const debouncedSearch = useCallback(
    debounce((mobile) => {
      if (mobile.trim()) {
        setIsSearching(true);
        fetchShops(mobile);
      } else {
        setIsSearching(false);
        setSearchError("");
        fetchShops();
      }
    }, 500), // 500ms delay
    []
  );

  // 🔹 Handle input change with automatic search
  const handleInputChange = (e) => {
    const mobile = e.target.value;
    setSearchMobile(mobile);
    
    if (mobile.trim()) {
      setIsTyping(true);
      setIsSearching(true);
      debouncedSearch(mobile);
    } else {
      setIsTyping(false);
      setIsSearching(false);
      setSearchError("");
      fetchShops(); // Immediately fetch all shops when cleared
    }
  };

  // 🔹 Clear search
  const handleClearSearch = () => {
    setSearchMobile("");
    setIsSearching(false);
    setIsTyping(false);
    setSearchError("");
    fetchShops();
  };

  // 🔹 Handle manual search button click
  const handleSearchClick = (e) => {
    e?.preventDefault();
    if (searchMobile.trim()) {
      setIsSearching(true);
      setIsTyping(false);
      fetchShops(searchMobile);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchPlans();
    
    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  // 🔹 Activate subscription
  const activateSubscription = async (shopId) => {
    const planId = selectedPlan[shopId];
    if (!planId) {
      alert("Please select a plan");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/adminDashboard/start-without-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ shopId, planId }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed");
      } else {
        alert("Subscription activated");
        // Refresh shops after activation
        if (searchMobile.trim()) {
          fetchShops(searchMobile);
        } else {
          fetchShops();
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (planId) =>
    plans.find((p) => p._id === planId)?.name || "—";

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header with Search Box */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Shop Subscriptions</h1>
          </div>
          
          {/* Search Box on the right side */}
          <div className="w-full md:w-auto">
            <div className="flex flex-col">
              <form onSubmit={handleSearchClick} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type mobile number to search..."
                    value={searchMobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                  {searchMobile && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  Search
                </button>
              </form>
              
              {/* Search status and indicators */}
              <div className="min-h-[20px]">
                {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Searching...</span>
                  </div>
                )}
                
                {isSearching && !isTyping && searchMobile && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      Results for: <span className="font-medium">{searchMobile}</span>
                      <span className="ml-2 text-gray-400">({shops.length} found)</span>
                    </span>
                    <button
                      onClick={handleClearSearch}
                      className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
              
              {searchError && (
                <div className="p-2 bg-red-900/20 border border-red-700/30 rounded text-red-300 text-sm">
                  {searchError}
                </div>
              )}
              
           
            </div>
          </div>
        </div>

        {/* Shops Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Shop</th>
                <th className="p-3">Place</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Status</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => {
                const isActive = shop.subscription?.isActive;

                return (
                  <tr key={shop._id} className="border-t text-white hover:bg-gray-800/20 transition">
                    <td className="p-3 font-medium">{shop.shopName}</td>
                    <td className="p-3">
                      {shop.place}, {shop.state}
                    </td>
                    <td className="p-3">
                      {shop.mobileNumber || "—"}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      {isActive ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* PLAN */}
                    <td className="p-3">
                      {isActive
                        ? getPlanName(shop.subscription?.plan)
                        : "—"}
                    </td>

                    {/* ACTION */}
                    <td className="p-3">
                      {isActive ? (
                        <span className="text-gray-400 text-sm">
                          Already Active
                        </span>
                      ) : (
                        <div className="flex gap-2 items-center text-black">
                          <select
                            className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedPlan[shop._id] || ""}
                            onChange={(e) =>
                              setSelectedPlan((prev) => ({
                                ...prev,
                                [shop._id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Plan</option>
                            {plans.map((plan) => (
                              <option key={plan._id} value={plan._id}>
                                {plan.name}
                              </option>
                            ))}
                          </select>

                          <button
                            disabled={loading}
                            onClick={() => activateSubscription(shop._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Activate
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {shops.length === 0 && !searchError && !isTyping && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-400">
                {isSearching && searchMobile
                  ? `No shops found with mobile: "${searchMobile}"`
                  : "No shops found"}
              </p>
              {isSearching && searchMobile && (
                <button
                  onClick={handleClearSearch}
                  className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View all shops
                </button>
              )}
            </div>
          )}
          
          {isTyping && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="animate-spin w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <p className="text-gray-400">Searching for "{searchMobile}"...</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}