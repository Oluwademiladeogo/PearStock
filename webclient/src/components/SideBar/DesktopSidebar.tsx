import Link from "next/link";
import { useRouter } from "next/router";
import { Sun, Moon } from "lucide-react";
import menuItems from "../../../data/menuItems";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function DesktopSidebar({
  darkMode,
  setDarkMode,
}: SidebarProps) {
  const router = useRouter();

  return (
    <div
      className={`hidden md:flex h-screen w-64 p-4 flex-col justify-between transition-all sticky top-0 ${
        darkMode ? "bg-blue-500 text-white" : "bg-blue-100 text-black"
      }`}
    >
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-2xl font-bold">📦 Inventory</span>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                router.pathname === item.path
                  ? "bg-blue-300 text-blue-900 font-semibold"
                  : "hover:bg-blue-200"
              } ${item.isLogout ? "mt-4 pt-2" : ""}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          className={`p-2 rounded-lg flex items-center space-x-1 ${
            !darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black"
          }`}
          onClick={() => setDarkMode(false)}
        >
          <Sun className="w-5 h-5" />
          <span className="hidden sm:inline">Light</span>
        </button>
        <button
          className={`p-2 rounded-lg flex items-center space-x-1 ${
            darkMode ? "bg-blue-600 text-white" : "bg-blue-300 text-black"
          }`}
          onClick={() => setDarkMode(true)}
        >
          <Moon className="w-5 h-5" />
          <span className="hidden sm:inline">Dark</span>
        </button>
      </div>
    </div>
  );
}
