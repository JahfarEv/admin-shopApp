import { UserIcon, LogoutIcon } from '@heroicons/react/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: '📊',
      title: "Dashboard",
      color: "indigo"
    },
    {
      path: "/admin/users",
      icon: '👥',
      title: "Users",
      color: "blue"
    },
    {
      path: "/admin/shops",
      icon: '🏪',
      title: "Shops",
      color: "green"
    },
    {
      path: "/admin/products",
      icon: '📦',
      title: "Products",
      color: "yellow"
    },
    {
      path: "/admin/subscription-plans",
      icon: '💳',
      title: "Subscriptions",
      color: "purple"
    },
    {
      path: "/admin/users/subscriptions",
      icon: '📈',
      title: "User Subscription",
      color: "pink"
    },
    {
      path: "/admin/settings",
      icon: '⚙️',
      title: "Settings",
      color: "gray"
    },
     {
      path: "/admin/aproval",
      icon: '✅',
      title: "Aproval",
      color: "pink"
    }
  ];

  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-700 dark:text-indigo-300',
      active: 'bg-indigo-600 dark:bg-indigo-700'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      active: 'bg-blue-600 dark:bg-blue-700'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      active: 'bg-green-600 dark:bg-green-700'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      active: 'bg-yellow-600 dark:bg-yellow-700'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      active: 'bg-purple-600 dark:bg-purple-700'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      text: 'text-pink-700 dark:text-pink-300',
      active: 'bg-pink-600 dark:bg-pink-700'
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      active: 'bg-gray-600 dark:bg-gray-700'
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <aside 
      className={`
        fixed md:sticky top-0 left-0 
        w-64 min-w-[16rem] h-screen
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        shadow-sm flex flex-col z-20 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const colors = colorClasses[item.color];
            
            return (
              <li key={index}>
                <Link 
                  to={item.path}
                  onClick={toggleSidebar}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg 
                    font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? `${colors.active} text-white`
                      : `${colors.bg} ${colors.text} hover:bg-opacity-50 dark:hover:bg-opacity-50`
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with User Info and Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@example.com</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogoutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;