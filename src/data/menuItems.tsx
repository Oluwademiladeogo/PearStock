import { Grid, Package, Wrench, Layers, Briefcase, PlusSquare, Home, FileText } from "lucide-react";

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

export default menuItems;