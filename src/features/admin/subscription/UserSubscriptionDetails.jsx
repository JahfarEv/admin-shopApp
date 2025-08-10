import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, Crown, AlertCircle } from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout';

export default function UserSubscriptionDetails() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [userRes, subRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getalluser`, { 
            headers: { Authorization: `Bearer ${token}` } 
          }),
          fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/getallsubscription`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
        ]);

        const userData = await userRes.json();
        const subData = await subRes.json();

        setUsers(userData.data?.filter(u => u.subscriptionId) || []);
        setSubscriptions(subData.subscriptions || subData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const mobile = user.mobileNumber?.toString() || '';
    let matchesSearch =
      user.name?.toLowerCase().includes(term) ||
      mobile.includes(term);

    const sub = subscriptions.find(s => s._id === user.subscriptionId);
    if (sub) {
      matchesSearch = matchesSearch || 
        sub.plan?.toLowerCase().includes(term) ||
        sub.subscriptionPlanDetails?.name?.toLowerCase().includes(term);
    }

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;

    const isActive = sub && new Date(sub.endDate) > new Date();
    return filterStatus === 'active' ? isActive : !isActive;
  });

  const getPlanColor = plan => {
    switch (plan?.toLowerCase()) {
      case 'premium': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'pro': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'basic': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const isSubscriptionActive = endDate => new Date(endDate) > new Date();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="ml-3 text-gray-600 dark:text-gray-400">Loading users & subscriptions...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor user subscription details</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or plan..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="block w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active Subscriptions</option>
              <option value="expired">Expired Subscriptions</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => {
            const sub = subscriptions.find(s => s._id === user.subscriptionId);
            const active = sub && isSubscriptionActive(sub.endDate);

            return (
              <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{user.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        active ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{user.mobileNumber}</span>
                  </div>

                  <div className="flex items-start mb-3">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-gray-900 dark:text-white">{user.state}, {user.place}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.locality} - {user.pincode}</p>
                    </div>
                  </div>

                  {sub ? (
                    <>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${getPlanColor(sub.plan)}`}>
                        <Crown className="h-4 w-4 mr-1" />
                        {sub.plan || 'Unknown'} Plan
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                          <span className="text-gray-900 dark:text-white">{sub.subscriptionPlanDetails?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                          <span className="text-gray-900 dark:text-white">₹{sub.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <span className="text-gray-900 dark:text-white">{sub.durationDays} days</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900 dark:text-white">
                                {new Date(sub.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className={`${active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {new Date(sub.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-md">
                      <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
                      <span className="text-yellow-700 dark:text-yellow-300">No subscription found</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <User className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No users found
              </h3>
              <p className="mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}