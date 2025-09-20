/**
 * Header Component
 *
 * This component renders the application header with different layouts for mobile and desktop.
 * It provides navigation, board management, and task creation functionality.
 *
 * Key Features:
 * - Responsive design (mobile vs desktop layouts)
 * - Board name display and selection
 * - Add task button with visual feedback
 * - Board options dropdown menu
 * - Theme-aware logo display
 * - Click-outside-to-close dropdown functionality
 *
 * Responsive Behavior:
 * - Mobile: Compact layout with mobile logo and icon-based buttons
 * - Desktop: Full layout with text labels and larger interactive elements
 */

import Image from "next/image";
import "@/styles/globals.css";
import { useTasks } from "@/contexts/TasksContext";
import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";

/**
 * Header Component
 *
 * Renders the main application header with board information,
 * navigation controls, and action buttons.
 */
function Header() {
  // Context hooks for accessing shared state and functions
  const {
    openTasksModal, // Function to open the add task modal
    isBoardsModalOpen, // Whether the boards modal is open
    toggleBoardsModal, // Function to toggle the boards modal
    openDeleteBoardModal, // Function to open the delete board modal
  } = useModal();
  const { tasks } = useTasks(); // Current tasks for button state
  const { currentBoard } = useBoards(); // Currently selected board
  const { theme } = useTheme(); // Current theme (light/dark)

  // Local state for dropdown management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown element

  /**
   * Close dropdown when clicking outside
   *
   * This effect adds a click listener to detect clicks outside the dropdown
   * and closes it automatically for better UX.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Handle board deletion
   *
   * Opens the delete board modal for the current board and closes the dropdown.
   */
  const handleDeleteBoard = () => {
    if (currentBoard) {
      openDeleteBoardModal(currentBoard);
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      {/* 
        Mobile Header Layout
        Optimized for small screens with compact design and icon-based navigation
      */}
      <div className="bg-theme-primary relative z-60 flex w-full items-center justify-between px-4 py-5 md:hidden">
        {/* Mobile logo and boards toggle */}
        <button
          onClick={toggleBoardsModal}
          aria-label="Open boards"
          className="flex items-center"
        >
          <Image
            src="/logo-mobile.svg"
            alt="header logo"
            width={24}
            height={25}
          />
        </button>

        {/* Current board name display */}
        <div className="flex gap-2 pl-4">
          <span className="text-theme-primary text-[18px] font-bold">
            {currentBoard?.name || "Select Board"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pl-19">
          {/* Add task button with visual feedback */}
          <button
            onClick={() => openTasksModal()}
            className={`${tasks.length !== 0 ? "bg-primary" : "bg-primary/20"} flex h-8 w-12 cursor-pointer items-center justify-center rounded-3xl`}
          >
            <Image
              alt="add task button"
              src="/icon-add-task-mobile.svg"
              width={12}
              height={12}
            />
          </button>

          {/* Board options dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
              aria-label="Board options"
            >
              <Image
                src="/icon-vertical-ellipsis.svg"
                alt="3-dot menu icon"
                width={4}
                height={16}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                <button
                  onClick={handleDeleteBoard}
                  className="w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete Board
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        Desktop Header Layout
        Full layout with text labels and larger interactive elements
      */}
      <div className="bg-theme-primary border-theme relative z-60 hidden w-full items-center justify-between border-b px-6 py-5 md:flex">
        {/* Left section: Logo and board info */}
        <div className="flex items-center gap-6">
          {/* Theme-aware logo */}
          <div className="flex items-center">
            <Image
              src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
              alt="kanban logo"
              width={152}
              height={25}
              className="cursor-pointer"
            />
          </div>

          {/* Visual separator */}
          <div className="bg-theme h-10 w-px" />

          {/* Current board name */}
          <div className="flex items-center gap-2">
            <span className="text-theme-primary text-[20px] font-bold">
              {currentBoard?.name || "Select Board"}
            </span>
          </div>
        </div>

        {/* Right section: Action buttons */}
        <div className="flex items-center gap-6">
          {/* Add task button with text label */}
          <button
            onClick={() => openTasksModal()}
            className={`${tasks.length !== 0 ? "bg-primary" : "bg-primary/20"} hidden h-12 cursor-pointer items-center justify-center rounded-3xl px-6 text-[15px] font-bold text-white md:flex`}
          >
            + Add New Task
          </button>

          {/* Board options dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
              aria-label="Board options"
            >
              <Image
                className="object-none"
                src="/icon-vertical-ellipsis.svg"
                alt="3-dot menu icon"
                width={4}
                height={16}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                <button
                  onClick={handleDeleteBoard}
                  className="w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete Board
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
