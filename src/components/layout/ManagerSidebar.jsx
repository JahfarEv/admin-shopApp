import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ManagerSidebar({
  isSidebarOpen,
  toggleSidebar,
  salesmanData,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("managerToken");
    navigate("/");
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="lg:hidden fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg z-50 flex items-center justify-center"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center p-6 border-b border-gray-700">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {salesmanData?.name?.charAt(0) || "S"}
          </div>
          <h3 className="text-lg font-semibold">Manager Portal</h3>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/manager/dashboard"
            className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
              isActive("/manager/dashboard") 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">📊</span> Overview
          </Link>
         
           <Link
            to="/manager/salesman"
            className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
              isActive("/salesman/shops") 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">🏪</span> My teams
          </Link>
          <Link
            to="/manager/shops"
            className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
              isActive("/salesman/shops") 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">🏪</span> My Shops
          </Link>
           <Link
            to="/salesman/profile"
            className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
              isActive("/manager/profile") 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-3">👤</span> Profile
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <span className="mr-3">🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}