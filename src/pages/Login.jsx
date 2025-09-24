// import { useState } from "react";
// import {
//   Mail,
//   Phone,
//   Lock,
//   Eye,
//   EyeOff,
//   Shield,
//   AlertCircle,
//   ArrowRight,
//   UserCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

// const roleConfig = {
//   admin: {
//     api: `${import.meta.env.VITE_APP_BACKEND_URL}/auth/admin/login`,
//     tokenKey: "adminToken",
//     dashboard: "/admin/dashboard",
//     authField: "email",
//   },
//   salesman: {
//     api: `${import.meta.env.VITE_APP_BACKEND_URL}/api/salesman/login`,
//     tokenKey: "salesmanToken",
//     dashboard: "/salesman/dashboard",
//     authField: "mobileNumber",
//   },
//   manager: {
//     api: `${import.meta.env.VITE_APP_BACKEND_URL}/api/manager/login`,
//     tokenKey: "managerToken",
//     dashboard: "/manager/dashboard",
//     authField: "mobileNumber",
//   },
// };

// export default function LoginPage() {
//   const [role, setRole] = useState("admin");
//   const [email, setEmail] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMsg("");

//     const payload = {
//       [roleConfig[role].authField]: role === "admin" ? email : mobileNumber,
//       password,
//     };

//     try {
//       const res = await fetch(roleConfig[role].api, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         setErrorMsg(errorData.message || "Login failed");
//         return;
//       }

//       const data = await res.json();

//       if (!data.token) {
//         setErrorMsg("Token not received. Try again.");
//         return;
//       }

//       localStorage.setItem(roleConfig[role].tokenKey, data.token);
//       navigate(roleConfig[role].dashboard);
//     } catch (err) {
//       console.error("Login error:", err);
//       setErrorMsg("Server error. Try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 to-teal-400 flex items-center justify-center p-4 relative overflow-hidden font-sans">
//       {/* Background elements */}
//       <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-float"></div>
//       <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-teal-400/20 rounded-full filter blur-3xl animate-pulse-float animation-delay-1000"></div>
//       <div className="absolute bottom-1/4 left-1/3 w-52 h-52 bg-pink-500/15 rounded-full filter blur-3xl animate-pulse-float animation-delay-2000"></div>
//       <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-yellow-500/15 rounded-full filter blur-3xl animate-pulse-float animation-delay-3000"></div>

//       {/* Login card */}
//       <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-3xl relative z-10">
//         {/* Header */}
//         <div className="text-center px-6 pt-8 pb-2">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-6">
//             <Shield className="text-white" size={32} />
//           </div>
//           <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
//             Portal Login
//           </h1>
//           <p className="text-white/90 text-sm">Select your role and sign in</p>
//         </div>

//         {/* Form */}
//         <form className="px-6 pb-6" onSubmit={handleSubmit}>
//           {/* Role selector */}
//           <div className="mb-5">
//             <label className="block text-sm font-medium text-white mb-2">
//               Login As
//             </label>
//             <div className="relative">
//               <UserCircle
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
//                 size={20}
//               />
//               <select
//                 className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70  focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300 appearance-none"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 // Add these styles for the dropdown options
//                 style={{
//                   // For the dropdown options
//                   color: "#000", // Dark text for better readability
//                 }}
//               >
//                 <option
//                   value="admin"
//                   className="bg-white text-gray-900" // Light background for options
//                 >
//                   Admin
//                 </option>
//                 <option value="salesman" className="bg-white text-gray-900">
//                   Salesman
//                 </option>
//                 <option value="manager" className="bg-white text-gray-900">
//                   Manager
//                 </option>
//               </select>
//               {/* Dropdown arrow indicator */}
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <svg
//                   className="w-5 h-5 text-white/80"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Email or Mobile field */}
//           {role === "admin" ? (
//             <div className="mb-5">
//               <label className="block text-sm font-medium text-white mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
//                   size={20}
//                 />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   autoComplete="new-email"
//                   className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="mb-5">
//               <label className="block text-sm font-medium text-white mb-2">
//                 Mobile Number
//               </label>
//               <div className="relative">
//                 <Phone
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   required
//                   autoComplete="new-tel"
//                   className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300"
//                   placeholder="Enter your mobile number"
//                   pattern="[0-9]{10}"
//                   maxLength="10"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Password field */}
//           <div className="mb-5">
//             <label className="block text-sm font-medium text-white mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
//                 size={20}
//               />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 autoComplete="new-password"
//                 className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300"
//                 placeholder="Enter your password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-white/80 hover:text-yellow-300 transition-colors duration-200 p-1"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Error message */}
//           {errorMsg && (
//             <div className="flex items-center gap-2 p-3 bg-pink-500/40 border border-pink-500/60 rounded-lg text-white text-sm mb-4 backdrop-blur animate-shake">
//               <AlertCircle size={16} />
//               <span>{errorMsg}</span>
//             </div>
//           )}

//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-gradient-to-br from-pink-500 to-yellow-400 text-white font-semibold py-4 px-6 rounded-xl text-base transition-all duration-300 hover:from-pink-600 hover:to-yellow-500 hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
//           >
//             <div className="flex items-center justify-center gap-2">
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Signing in...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Sign In</span>
//                   <ArrowRight size={18} />
//                 </>
//               )}
//             </div>
//           </button>

//           {/* Register link */}
//           {(role === "salesman" || role === "manager") && (
//             <div className="mt-4 text-center">
//               <p className="text-white/80 text-sm">
//                 Don't have an account?{" "}
//                 <a
//                   href={`/${role}/register`}
//                   className="text-yellow-300 font-medium hover:text-pink-300 hover:underline"
//                 >
//                   Register here
//                 </a>
//               </p>
//             </div>
//           )}
//         </form>

//         {/* Footer */}
//         <div className="text-center pb-6">
//           <p className="text-white/80 text-xs">
//             Secure access • Role-based login system
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  ArrowRight,
  UserCircle,
} from "lucide-react";
import { loginUser, clearError } from "../features/store/auth/authSlice";
import { roleConfig } from "../utils/roleConfig";



export default function LoginPage() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const credentials = {
      [roleConfig[role].authField]: role === "admin" ? email : mobileNumber,
      password,
    };

    const resultAction = await dispatch(loginUser({ role, credentials }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      localStorage.setItem(roleConfig[role].tokenKey, resultAction.payload.token);
      navigate(roleConfig[role].dashboard);
    }
  };

  // Clear error when changing role
  useEffect(() => {
    dispatch(clearError());
  }, [role, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-teal-400 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-float"></div>
      <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-teal-400/20 rounded-full filter blur-3xl animate-pulse-float animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-52 h-52 bg-pink-500/15 rounded-full filter blur-3xl animate-pulse-float animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-yellow-500/15 rounded-full filter blur-3xl animate-pulse-float animation-delay-3000"></div>

      {/* Login card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-3xl relative z-10">
        {/* Header */}
        <div className="text-center px-6 pt-8 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-full mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Portal Login
          </h1>
          <p className="text-white/90 text-sm">Select your role and sign in</p>
        </div>

        {/* Form */}
        <form className="px-6 pb-6" onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-2">
              Login As
            </label>
           <div className="relative">
              <UserCircle
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
                size={20}
              />
              <select
                className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70  focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300 appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                // Add these styles for the dropdown options
                style={{
                  // For the dropdown options
                  color: "#000", // Dark text for better readability
                }}
              >
                <option
                  value="admin"
                  className="bg-white text-gray-900" // Light background for options
                >
                  Admin
                </option>
                <option value="salesman" className="bg-white text-gray-900">
                  Salesman
                </option>
                <option value="manager" className="bg-white text-gray-900">
                  Manager
                </option>
              </select>
              {/* Dropdown arrow indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Email or Mobile field */}
          {role === "admin" ? (
            <div className="mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="new-email"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <label className="block text-sm font-medium text-white mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
                  size={20}
                />
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  autoComplete="new-tel"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300"
                  placeholder="Enter your mobile number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/70 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30 focus:bg-white/15 outline-none backdrop-blur transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-white/80 hover:text-yellow-300 transition-colors duration-200 p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-pink-500/40 border border-pink-500/60 rounded-lg text-white text-sm mb-4 backdrop-blur animate-shake">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-pink-500 to-yellow-400 text-white font-semibold py-4 px-6 rounded-xl text-base transition-all duration-300 hover:from-pink-600 hover:to-yellow-500 hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </div>
          </button>

          {/* Register link */}
          {/* {(role === "salesman" || role === "manager") && (
            <div className="mt-4 text-center">
              <p className="text-white/80 text-sm">
                Don't have an account?{" "}
                <a
                  href={`/${role}/register`}
                  className="text-yellow-300 font-medium hover:text-pink-300 hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          )} */}
        </form>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-white/80 text-xs">
            Secure access • Role-based login system
          </p>
        </div>
      </div>
    </div>
  );
}