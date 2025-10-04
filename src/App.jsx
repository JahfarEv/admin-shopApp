// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin Pages
import AdminDashboard from "./features/admin/AdminDashboard";
import Login from "./pages/Login";
import UserManagement from "./features/admin/user/UserManagement";
import ShopManagement from "./features/admin/shops/ShopManagement";
import ProductManagement from "./features/admin/product/ProductManagement";
import CommissionSettings from "./features/admin/settings/Settings";
import SubscriptionPlans from "./features/admin/subscription/SubscriptionPlans";
import EditSubscriptionPlans from "./features/admin/subscription/EditSubscriptionPlans";
import UserSubscriptionDetails from "./features/admin/subscription/UserSubscriptionDetails";
import ProductDetails from "./features/admin/product/ProductDetails";
import NotFound from "./pages/NotFound";
import SalesmanRegistration from "./features/salesman/SalesmanRegistration";
import SalesmanDashboard from "./features/salesman/SalesmanDashboard";
import SalesmanProfile from "./features/salesman/SalesmanProfile";
import SalesmanShops from "./features/salesman/SalesmanShops";
import UnapprovedSalesmen from "./features/admin/aproval/Aproval";
import ManagerRegistration from "./features/manager/ManagerRegistration";
import ManagerDashboard from "./features/manager/ManagerDashboard";
import TeamPerformance from "./features/manager/ManagerTeams";
import ManagersPage from "./features/admin/managers/Managers";
import Salesman from "./features/admin/salesmans/Salesman";
import CommissionReport from "./features/admin/reports/CommissionReport";
import GSTReport from "./features/admin/reports/GSTReport";
import TDSReport from "./features/admin/reports/TDSReport";
import CreateAdvertisement from "./features/admin/advertisement/CreateAdvertisement"
import AdvertisementList from "./features/admin/advertisement/AdvertisementList"
// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/salesman/register" element={<SalesmanRegistration />} />
          <Route path="/manager/register" element={<ManagerRegistration />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminDashboard />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/shops" element={<ShopManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route
              path="/admin/shops/products/:id"
              element={<ProductDetails />}
            />
            <Route path="/admin/settings" element={<CommissionSettings />} />
            <Route
              path="/admin/subscription-plans"
              element={<SubscriptionPlans />}
            />
            <Route
              path="/subscription-plans/edit"
              element={<EditSubscriptionPlans />}
            />
            <Route
              path="/admin/users/subscriptions"
              element={<UserSubscriptionDetails />}
            />
            <Route path="/admin/aproval" element={<UnapprovedSalesmen />} />
            <Route path="/admin/managers" element={<ManagersPage />} />
            <Route path="/admin/salesman" element={<Salesman />} />
<Route path="/admin/advertisements/create" element={<CreateAdvertisement />} />
<Route path="/admin/advertisements" element={<AdvertisementList />} />

            <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
            <Route path="/salesman/profile" element={<SalesmanProfile />} />
            <Route path="/salesman/shops" element={<SalesmanShops />} />
          </Route>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/teams" element={<TeamPerformance />} />
          <Route
            path="/admin/report/commission"
            element={<CommissionReport />}
          />
          <Route path="/admin/report/gst" element={<GSTReport />} />
          <Route path="/admin/report/tds" element={<TDSReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
