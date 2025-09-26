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
import Button from "./Button";

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
    isBoardsModalEntered, // Whether the boards modal has entered (animation state)
    toggleBoardsModal, // Function to toggle the boards modal
    openDeleteBoardModal, // Function to open the delete board modal
    openEditBoardModal, // Function to open the edit board modal
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
   * Handle board editing
   *
   * Opens the edit board modal for the current board and closes the dropdown.
   */
  const handleEditBoard = () => {
    if (currentBoard) {
      openEditBoardModal(currentBoard);
      setIsDropdownOpen(false);
    }
  };

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
      <div className="bg-theme-primary relative z-60 grid w-full grid-cols-[25px_250px_1fr] items-center justify-between px-4 py-[17px] md:hidden">
        {/* Mobile logo and boards toggle */}
        <button
          aria-label="Open boards"
          onClick={() => toggleBoardsModal()}
          className="flex items-center"
        >
          <Image
            src="/logo-mobile.svg"
            alt="header logo"
            width={24}
            height={25}
          />
        </button>

        {/* Current board name display (open boards on mobile) */}
        <button
          type="button"
          aria-label="Open boards"
          onClick={() => toggleBoardsModal()}
          className="flex cursor-pointer items-center gap-2 pl-4"
        >
          <span className="text-theme-primary text-[18px] font-bold">
            {currentBoard?.name || "Select Board"}
          </span>
          <Image
            className={`mt-2 -translate-y-1/2 object-none transition-transform ${isBoardsModalOpen ? "rotate-180" : ""}`}
            src="/icon-chevron-down.svg"
            width={9}
            height={5}
            alt="dropdown arrow"
          />
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {/* Add task button with visual feedback */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openTasksModal()}
            className={`${tasks.length !== 0 ? "" : "opacity-20"} h-8 w-12 p-0`}
          >
            <Image
              alt="add task button"
              src="/icon-add-task-mobile.svg"
              width={12}
              height={12}
            />
          </Button>

          {/* Board options dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
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
                  onClick={handleEditBoard}
                  className="w-full px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Edit Board
                </button>
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
      <div className="bg-theme-primary border-theme relative z-40 hidden w-[full] items-center justify-between border-b px-6 md:flex">
        {/* Left section: Logo and board info */}
        <div className="flex items-center">
          {/* Theme-aware logo */}
          <div className="flex items-center">
            <Image
              src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
              alt="kanban logo"
              width={152}
              height={25}
              className="cursor-pointer"
            />
            {/* Visual separator */}
            <div className="hidden w-[1px] bg-[#979797] opacity-20 md:ml-6 md:block md:h-[80px] lg:ml-8 lg:h-[96px]" />
          </div>

          {/* Current board name with animated gap (sync with sidebar animation) */}
          <div
            className={`ml-[26px] flex items-center gap-2 transition-transform duration-300 ease-out ${isBoardsModalEntered ? "translate-x-[105px]" : "translate-x-0"}`}
          >
            <span className="text-theme-primary text-[20px] font-bold lg:pb-[6px] lg:pl-2 lg:text-[24px] lg:tracking-wide">
              {currentBoard?.name || "Select Board"}
            </span>
          </div>
        </div>

        {/* Right section: Action buttons */}
        <div className="flex items-center gap-6 lg:pb-2">
          {/* Add task button with text label */}
          <Button
            variant="primary"
            onClick={() => openTasksModal()}
            className={`${tasks.length !== 0 ? "" : "opacity-20"} hidden md:flex`}
          >
            + Add New Task
          </Button>

          {/* Board options dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 lg:pr-2"
              aria-label="Board options"
            >
              <Image
                src="/icon-vertical-ellipsis.svg"
                alt="3-dot menu icon"
                width={5}
                height={20}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                <button
                  onClick={handleEditBoard}
                  className="w-full px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Edit Board
                </button>
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
