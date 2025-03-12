import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/SideBar/SideBar";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/login";
import Items from './components/pages/Items';
import Signup from "./components/pages/Signup";
import Logout from "./components/pages/Logout";
// import Logout from './components/pages/Logout';

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/logout";

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex-1 p-4 ${hideSidebar ? 'w-full' : ''}`}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;