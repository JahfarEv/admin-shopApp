// TeamPerformance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/layout/ManagerSidebar";

export default function TeamPerformance() {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch team data
    const fetchTeamData = async () => {
      try {
        // Replace with actual API call
        const mockData = [
          {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul@example.com",
            mobileNumber: "9876543210",
            totalShops: 15,
            revenueGenerated: 125000,
            isActive: true
          },
          {
            id: 2,
            name: "Priya Patel",
            email: "priya@example.com",
            mobileNumber: "8765432109",
            totalShops: 22,
            revenueGenerated: 187500,
            isActive: true
          },
          {
            id: 3,
            name: "Amit Singh",
            email: "amit@example.com",
            mobileNumber: "7654321098",
            totalShops: 8,
            revenueGenerated: 65000,
            isActive: false
          },
          {
            id: 4,
            name: "Neha Gupta",
            email: "neha@example.com",
            mobileNumber: "6543210987",
            totalShops: 18,
            revenueGenerated: 152000,
            isActive: true
          },
          {
            id: 5,
            name: "Vikram Joshi",
            email: "vikram@example.com",
            mobileNumber: "9432109876",
            totalShops: 12,
            revenueGenerated: 98000,
            isActive: true
          }
        ];
        
        setTeamData(mockData);
        // const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/manager/team-performance`);
        // if (!response.ok) throw new Error('Failed to fetch team data');
        // const data = await response.json();
        // setTeamData(data.teamMembers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-center text-gray-700 mb-6">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
      <ManagerSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-xl font-bold text-gray-800">Team Performance Dashboard</h1>
            
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Team Performance</h1>
              <p className="text-gray-600 mt-2">Overview of your sales team's performance metrics</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salesman
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Shops
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamData.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.mobileNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{member.totalShops}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">₹{member.revenueGenerated.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Total Team Members</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {teamData.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Total Shops</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {teamData.reduce((sum, member) => sum + member.totalShops, 0)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₹{teamData.reduce((sum, member) => sum + member.revenueGenerated, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}