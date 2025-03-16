import { Grid, Package, LogOut } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: Grid },
  { name: "Products", path: "/products", icon: Package },
  { name: "Logout", path: "/logout", icon: LogOut, isLogout: true },
];

export default menuItems;
