import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X, Grid, Package, Wrench, Layers, Briefcase, PlusSquare, Home, FileText } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: Grid },
  { name: "Items", path: "/items", icon: Package },
  { name: "Tools", path: "/tools", icon: Wrench },
  { name: "Assets", path: "/assets", icon: Layers },
  { name: "Project", path: "/project", icon: Briefcase },
  { name: "Request", path: "/request", icon: PlusSquare },
  { name: "On hand", path: "/on-hand", icon: Home },
  { name: "GRN Report", path: "/grn-report", icon: FileText },
];

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex h-screen w-64 p-4 flex-col justify-between transition-all ${darkMode ? "bg-blue-500 text-white" : "bg-blue-100 text-black"}`}
      >
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl font-bold">📦 Inventory</span>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg transition-all ${isActive ? "bg-blue-300 text-blue-900 font-semibold" : "hover:bg-blue-200"}`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className={`p-2 rounded-lg flex items-center space-x-1 ${!darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black"}`}
            onClick={() => setDarkMode(false)}
          >
            <Sun className="w-5 h-5" />
            <span className="hidden sm:inline">Light</span>
          </button>
          <button
            className={`p-2 rounded-lg flex items-center space-x-1 ${darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black"}`}
            onClick={() => setDarkMode(true)}
          >
            <Moon className="w-5 h-5" />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>
      </div>

      {/* Floating Mobile Menu */}
      <div className="md:hidden">
        {/* Floating Menu Button - Now at top right */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg ${
            darkMode ? "bg-blue-700" : "bg-blue-600"
          } text-white`}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Dropdown Menu - Now appears below the button */}
        {isMobileMenuOpen && (
          <div 
            className={`fixed top-16 right-4 z-40 rounded-lg shadow-xl overflow-hidden ${
              darkMode ? "bg-blue-500 text-white" : "bg-blue-100 text-black"
            }`}
            style={{ maxWidth: "80vw", maxHeight: "80vh" }}
          >
            <div className="p-3 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center space-x-2 mb-4 px-2">
                <span className="text-xl font-bold">📦 Inventory</span>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-lg transition-all ${
                        isActive ? "bg-blue-300 text-blue-900 font-semibold" : "hover:bg-blue-200"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="flex justify-start space-x-2 mt-4">
                <button
                  className={`p-2 rounded-lg flex items-center space-x-1 ${
                    !darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black"
                  }`}
                  onClick={() => {
                    setDarkMode(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </button>
                <button
                  className={`p-2 rounded-lg flex items-center space-x-1 ${
                    darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black"
                  }`}
                  onClick={() => {
                    setDarkMode(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}