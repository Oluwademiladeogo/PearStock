import { useState } from "react";
import DesktopSidebar from "./DesktopSidebar.tsx";
import MobileSidebar from "./MobileSidebar.tsx";

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <DesktopSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <MobileSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
    </>
  );
}