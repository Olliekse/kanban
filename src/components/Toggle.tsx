/**
 * Theme Toggle Component
 *
 * This component renders a custom toggle switch for switching between light and dark themes.
 * It provides a visually appealing toggle interface with smooth animations.
 *
 * Key Features:
 * - Custom styled toggle switch
 * - Smooth transition animations
 * - Accessible checkbox input (hidden but functional)
 * - Theme state integration
 * - Visual feedback for current theme
 *
 * Design:
 * - Circular toggle switch with sliding indicator
 * - Uses CSS transitions for smooth animations
 * - Accessible with proper label and hidden checkbox
 * - Responsive design that works on all screen sizes
 */

"use client";

import { useTheme } from "@/contexts/ThemeContext";

/**
 * Toggle Component Props
 *
 * Currently empty but defined for future extensibility.
 */
interface ToggleProps {}

/**
 * Theme Toggle Component
 *
 * Renders a custom toggle switch that allows users to switch between
 * light and dark themes. The toggle uses a hidden checkbox for accessibility
 * while providing a custom visual design.
 */
function Toggle() {
  // Access theme context for current theme and toggle function
  const { theme, toggleTheme } = useTheme();

  // Determine if the toggle should be in the "active" (dark) state
  const isActive = theme === "dark";

  /**
   * Handle toggle change
   *
   * This function is called when the toggle is clicked.
   * It delegates to the theme context's toggleTheme function.
   */
  const handleToggleChange = () => {
    toggleTheme();
  };

  return (
    <label className="flex cursor-pointer items-center select-none">
      {/* 
        Toggle container with relative positioning for the sliding indicator
        Uses a fixed height and width for consistent sizing
      */}
      <div className="relative h-5 w-10">
        {/* 
          Hidden checkbox input for accessibility
          The checkbox is visually hidden but still functional for screen readers
          and keyboard navigation
        */}
        <input
          type="checkbox"
          checked={isActive}
          onChange={handleToggleChange}
          className="peer sr-only"
        />

        {/* 
          Background track of the toggle
          Uses the primary color and rounded-full for a pill shape
        */}
        <div className="bg-primary block h-5 w-10 rounded-full"></div>

        {/* 
          Sliding indicator (dot) that moves based on the toggle state
          - Starts at left position (3px from left)
          - Moves to right position when checked (translate-x-5)
          - Smooth transition animation
          - White background for contrast against the primary color track
        */}
        <div className="dot absolute top-[3px] left-[3px] h-[14px] w-[14px] rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}

export default Toggle;
