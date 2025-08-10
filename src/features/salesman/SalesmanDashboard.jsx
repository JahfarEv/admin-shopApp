// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import SalesmanSidebar from "../../components/layout/SalesmanSidebar";

// export default function SalesmanDashboard() {
//   const [totalShops, setTotalShops] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalCommission, setTotalCommission] = useState(0);
//   const [salesmanData, setSalesmanData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const getSalesmanIdFromToken = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       console.log(decoded,'decoded');
//       return decoded.id || decoded._id;
//     } catch (err) {
//       console.error("Error decoding token:", err);
//       return null;
//     }
//   };

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const token = localStorage.getItem("salesmanToken");
//         if (!token) {
//           navigate("/salesman/login");
//           return;
//         }

//         const salesmanId = getSalesmanIdFromToken(token);
//         if (!salesmanId) {
//           throw new Error("Unable to get salesman ID from token");
//         }

//         setLoading(true);

//         const detailsRes = await fetch(
//           `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/details/${salesmanId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!detailsRes.ok) {
//           throw new Error("Failed to fetch salesman details");
//         }

//         const detailsData = await detailsRes.json();

//         if (detailsData.salesman) {
//           setSalesmanData(detailsData.salesman);

//           if (detailsData.salesman.shopsAddedBySalesman) {
//             const shops = detailsData.salesman.shopsAddedBySalesman;
//             setTotalShops(shops.length);

//             const amount = shops.reduce(
//               (sum, shop) => sum + (shop.totalSales || 0),
//               0
//             );
            
//             const commission = detailsData.salesman.salesCommissionEarned?.[0].amount || 0;

//             setTotalAmount(amount);
//             setTotalCommission(commission);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError(err.message);
//         if (
//           err.message.includes("invalid token") ||
//           err.message.includes("jwt malformed")
//         ) {
//           localStorage.removeItem("salesmanToken");
//           navigate("/salesman/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [navigate]);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         <p className="mt-4 text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//         <p className="text-red-500 mb-4">Error: {error}</p>
//         <button 
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//           onClick={() => window.location.reload()}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
//       {/* Sidebar */}
//       <SalesmanSidebar
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         salesmanData={salesmanData}
//       />

//       {/* Main Content */}
//       <div className="flex-1 overflow-x-hidden">
//         {/* Mobile Header */}
//         <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
//           <button 
//             onClick={toggleSidebar}
//             className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//             </svg>
//           </button>
//           <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
//           <div className="w-6"></div> {/* Spacer for alignment */}
//         </div>

//         {/* Content */}
//         <main className="p-4 md:p-6">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">
//               Welcome back, {salesmanData?.name || "Salesman"}!
//             </h1>
//             <div className="mt-2 md:mt-0">
//               <span className="text-sm text-gray-600">Status: </span>
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 salesmanData?.isApproved 
//                   ? "bg-green-100 text-green-800" 
//                   : "bg-yellow-100 text-yellow-800"
//               }`}>
//                 {salesmanData?.isApproved ? "Approved" : "Pending"}
//               </span>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             {/* Shops Managed */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
//               <div className="flex justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">Shops Managed</h3>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{totalShops}</p>
//                 </div>
//                 <div className="text-4xl text-gray-200">🏬</div>
//               </div>
//             </div>

//             {/* Total Sales */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">
//                     {totalCommission.toLocaleString("en-IN", {
//                       style: "currency",
//                       currency: "INR",
//                       maximumFractionDigits: 0,
//                     })}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">All-time revenue</p>
//                 </div>
//                 <div className="text-4xl text-gray-200">📈</div>
//               </div>
//             </div>

//             {/* Your Commission */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-teal-50">
//               <div className="flex justify-between">
//                 <div>
//                   <h3 className="text-gray-500 text-sm font-medium">Your Commission</h3>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">
//                     {totalAmount.toLocaleString("en-IN", {
//                       style: "currency",
//                       currency: "INR",
//                       maximumFractionDigits: 0,
//                     })}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">Earned so far</p>
//                 </div>
//                 <div className="text-4xl text-gray-200">💰</div>
//               </div>
//             </div>
//           </div>

//           {/* Financial Details */}
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
//               Financial Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
//                 <h4 className="text-gray-500 text-sm font-medium">Total Income</h4>
//                 <div className="text-2xl font-bold text-gray-800 my-2">
//                   {totalCommission.toLocaleString("en-IN", {
//                     style: "currency",
//                     currency: "INR",
//                   })}
//                 </div>
//                 <div className="flex justify-between text-xs text-gray-500">
//                   <span>From {totalShops} active shops</span>
//                   <span>Updated: {new Date().toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Profile Section */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
//               <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
//               <a 
//                 href="/salesman/profile" 
//                 className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
//               >
//                 Edit Profile
//               </a>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Personal Information */}
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="font-medium text-gray-800 mb-3">Personal Information</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Agent Code:</span>
//                     <span className="text-sm font-medium text-gray-800">
//                       {salesmanData?.agentCode?.[0] || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Email:</span>
//                     <span className="text-sm font-medium text-gray-800">
//                       {salesmanData?.email}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Mobile:</span>
//                     <span className="text-sm font-medium text-gray-800">
//                       {salesmanData?.mobileNumber}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Manager:</span>
//                     <span className="text-sm font-medium text-gray-800">
//                       {salesmanData?.manager || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Details */}
//               {salesmanData?.bankAccountNumber && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h4 className="font-medium text-gray-800 mb-3">Bank Details</h4>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">Bank:</span>
//                       <span className="text-sm font-medium text-gray-800">
//                         {salesmanData.bankName}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">Account:</span>
//                       <span className="text-sm font-medium text-gray-800">
//                         {salesmanData.bankAccountNumber}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">IFSC:</span>
//                       <span className="text-sm font-medium text-gray-800">
//                         {salesmanData.ifscCode}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-500">PAN:</span>
//                       <span className="text-sm font-medium text-gray-800">
//                         {salesmanData.pancardNumber}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }



import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SalesmanSidebar from "../../components/layout/SalesmanSidebar";
import { fetchSalesmanData, toggleSidebar, resetError } from "../store/salesman/salesmanSlice";

export default function SalesmanDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const {
    data: salesmanData,
    totalShops,
    totalAmount,
    totalCommission,
    loading,
    error,
    isSidebarOpen
  } = useSelector((state) => state.salesman);

  useEffect(() => {
    const token = localStorage.getItem("salesmanToken");
    if (!token) {
      navigate("/salesman/login");
      return;
    }

    dispatch(fetchSalesmanData());
  }, [dispatch, navigate]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => {
            dispatch(resetError());
            dispatch(fetchSalesmanData());
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
      {/* Sidebar */}
      <SalesmanSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={handleToggleSidebar}
        salesmanData={salesmanData}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <button 
            onClick={handleToggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {/* Content */}
        <main className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {salesmanData?.name || "Salesman"}!
            </h1>
            <div className="mt-2 md:mt-0">
              <span className="text-sm text-gray-600">Status: </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                salesmanData?.isApproved 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {salesmanData?.isApproved ? "Approved" : "Pending"}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Shops Managed */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Shops Managed</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{totalShops}</p>
                </div>
                <div className="text-4xl text-gray-200">🏬</div>
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {totalCommission.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All-time revenue</p>
                </div>
                <div className="text-4xl text-gray-200">📈</div>
              </div>
            </div>

            {/* Your Commission */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Your Commission</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {totalAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Earned so far</p>
                </div>
                <div className="text-4xl text-gray-200">💰</div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Financial Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="text-gray-500 text-sm font-medium">Total Income</h4>
                <div className="text-2xl font-bold text-gray-800 my-2">
                  {totalCommission.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>From {totalShops} active shops</span>
                  <span>Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
              <a 
                href="/salesman/profile" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
              >
                Edit Profile
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Personal Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Agent Code:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {salesmanData?.agentCode?.[0] || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {salesmanData?.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Mobile:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {salesmanData?.mobileNumber}
                    </span>
                  </div>
                 <div className="flex justify-between">
  <span className="text-sm text-gray-500">Manager:</span>
  <span className="text-sm font-medium text-gray-800">
    {salesmanData?.manager?.name || "N/A"}
  </span>
</div>

                </div>
              </div>

              {/* Bank Details */}
              {salesmanData?.bankAccountNumber && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Bank Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Bank:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {salesmanData.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {salesmanData.bankAccountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IFSC:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {salesmanData.ifscCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">PAN:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {salesmanData.pancardNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}