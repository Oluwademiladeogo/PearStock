import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import menuItems from "../../data/menuItems";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function MobileSidebar({ darkMode, setDarkMode }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
                      isActive
                        ? "bg-blue-300 text-blue-900 font-semibold"
                        : "hover:bg-blue-200"
                    } ${item.isLogout ? "mt-4 pt-2" : ""}`
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
                  !darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-300 text-black"
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
  );
}
