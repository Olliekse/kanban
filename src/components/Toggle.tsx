"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface ToggleProps {}

function Toggle() {
  const { theme, toggleTheme } = useTheme();
  const isActive = theme === "dark";

  const handleToggleChange = () => {
    toggleTheme();
  };

  return (
    <label className="flex cursor-pointer items-center select-none">
      <div className="relative h-5 w-10">
        <input
          type="checkbox"
          checked={isActive}
          onChange={handleToggleChange}
          className="peer sr-only"
        />
        <div className="bg-primary block h-5 w-10 rounded-full"></div>
        <div className="dot absolute top-[3px] left-[3px] h-[14px] w-[14px] rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}

export default Toggle;
