import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/SideBar/SideBar";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/login";
// import Items from './pages/Items';
// import Tools from './pages/Tools';
// import Assets from './pages/Assets';
// import Project from './pages/Project';
// import Request from './pages/Request';
// import OnHand from './pages/OnHand';
// import GRNReport from './pages/GRNReport';
// import Logout from './pages/Logout';

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/logout";

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex-1 p-4 ${hideSidebar ? 'w-full' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Dashboard />} />
          <Route path="/tools" element={<Dashboard />} />
          <Route path="/assets" element={<Dashboard />} />
          <Route path="/project" element={<Dashboard />} />
          <Route path="/request" element={<Dashboard />} />
          <Route path="/on-hand" element={<Dashboard />} />
          <Route path="/grn-report" element={<Dashboard />} />
          <Route path="/logout" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;