import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/SideBar/SideBar";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/login";
import Products from "./components/pages/Products";
import Signup from "./components/pages/Signup";
import Logout from "./components/pages/Logout";
import Home from "./components/pages/home";
import ForgotPassword from "./components/pages/ForgotPassword";
import VerifyOtp from "./components/pages/VerifyOTP";
// import Logout from './components/pages/Logout';

function App() {
  const location = useLocation();
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/logout" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp";

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex-1 p-4 ${hideSidebar ? "w-full" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
