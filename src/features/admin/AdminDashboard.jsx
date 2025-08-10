import AdminLayout from '../../components/layout/AdminLayout';
import StatsCard from '../../components/charts/StatsCard';
import RecentActivity from '../../components/charts/RecentActivity';
import SalesChart from '../../components/charts/SalesChart';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalShops, setTotalShops] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch users
        const userRes = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getalluser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!userRes.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const userData = await userRes.json();
        const users = userData.data || [];
        setTotalUsers(users.length);

        // Calculate subscribed users
        const subscribedCount = users.reduce((count, user) => {
          return user.subscriptionId ? count + 1 : count;
        }, 0);
        setTotalSubscriptions(subscribedCount);

        // Fetch shops
        const shopRes = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallshops`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!shopRes.ok) {
          throw new Error('Failed to fetch shops');
        }
        
        const shopData = await shopRes.json();
        setTotalShops(shopData.length || 0);
        
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
        setTotalUsers(0);
        setTotalShops(0);
        setTotalSubscriptions(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, [navigate]);

  const stats = [
    { title: "Total Users", value: totalUsers.toString(), change: "+12%", trend: "up" },
    { title: "Total Subscribers", value: totalSubscriptions.toString(), change: "+8%", trend: "up" },
    { title: "Total Shops", value: totalShops.toString(), change: "+5%", trend: "up" },
    { title: "Conversion Rate", value: `${totalShops > 0 ? Math.round((totalSubscriptions / totalUsers) * 100) : 0}%`, change: "-3%", trend: "down" }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Generate Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Overview</h2>
            <SalesChart />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <RecentActivity />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;