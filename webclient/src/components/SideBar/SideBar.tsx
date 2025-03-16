import { useState } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <DesktopSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <MobileSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  );
}
