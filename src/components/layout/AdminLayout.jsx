import { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark' : ''}`}>
      {/* Mobile menu toggle */}
      <button
        className="md:hidden fixed top-4 right-4 z-[1100] bg-slate-900/90 text-white rounded-lg p-2 text-xl backdrop-blur dark:bg-white/10"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <TopHeader toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;