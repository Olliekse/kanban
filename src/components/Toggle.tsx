import { useState } from "react";

interface ToggleProps {}

function Toggle() {
  const [isActive, setIsActive] = useState(false);

  const handleToggleChange = () => {
    setIsActive(!isActive);
  };

  return (
    <label className="flex cursor-pointer items-center select-none">
      <div className="relative h-5 w-10">
        <input
          type="checkbox"
          checked={isActive}
          onChange={handleToggleChange}
          className="sr-only peer"
        />
        <div className="block h-5 w-10 rounded-full  bg-primary"></div>
        <div className="dot absolute top-[3px] left-[3px] h-[14px] w-[14px] rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}

export default Toggle;
