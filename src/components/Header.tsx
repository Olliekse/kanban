import Image from "next/image";
import "@/styles/globals.css";
import { useTasks } from "@/contexts/TasksContext";
import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";

function Header() {
  const {
    openTasksModal,
    isBoardsModalOpen,
    toggleBoardsModal,
    openDeleteBoardModal,
  } = useModal();
  const { tasks } = useTasks();
  const { currentBoard } = useBoards();
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const handleDeleteBoard = () => {
    if (currentBoard) {
      openDeleteBoardModal(currentBoard);
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      {/* Mobile header */}
      <div className="bg-theme-primary relative z-60 flex w-full items-center justify-between px-4 py-5 md:hidden">
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
        <div className="flex gap-2 pl-4">
          <span className="text-theme-primary text-[18px] font-bold">
            {currentBoard?.name || "Select Board"}
          </span>
        </div>
        <div className="flex gap-4 pl-19">
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

      {/* Tablet & up header */}
      <div className="bg-theme-primary border-theme relative z-60 hidden w-full items-center justify-between border-b px-6 py-5 md:flex">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleBoardsModal}
            aria-label="Toggle boards sidebar"
            className="flex items-center"
          >
            <Image
              src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
              alt="kanban logo"
              width={152}
              height={25}
              className="cursor-pointer"
            />
          </button>
          <div className="bg-theme h-10 w-px" />
          <div className="flex items-center gap-2">
            <span className="text-theme-primary text-[20px] font-bold">
              {currentBoard?.name || "Select Board"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => openTasksModal()}
            className={`${tasks.length !== 0 ? "bg-primary" : "bg-primary/20"} hidden h-12 cursor-pointer items-center justify-center rounded-3xl px-6 text-[15px] font-bold text-white md:flex`}
          >
            + Add New Task
          </button>
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
