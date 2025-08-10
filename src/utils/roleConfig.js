// src/utils/roleConfig.js
export const roleConfig = {
  admin: {
    api: `${import.meta.env.VITE_APP_BACKEND_URL}/auth/admin/login`,
    tokenKey: "adminToken",
    dashboard: "/admin/dashboard",
    authField: "email"
  },
  salesman: {
    api: `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/login`,
    tokenKey: "salesmanToken",
    dashboard: "/salesman/dashboard",
    authField: "mobileNumber"
  },
  manager: {
    api: `${import.meta.env.VITE_APP_BACKEND_URL}/api/manager/login`,
    tokenKey: "managerToken",
    dashboard: "/manager/dashboard",
    authField: "mobileNumber"
  }
};