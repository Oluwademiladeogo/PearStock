import { Grid, Package, LogOut } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: Grid },
  { name: "Items", path: "/items", icon: Package },
  { name: "Logout", path: "/logout", icon: LogOut, isLogout: true },
];

export default menuItems;