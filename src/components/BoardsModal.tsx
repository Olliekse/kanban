import Image from "next/image";
import Toggle from "./Toggle";
import AddBoardModal from "./AddBoardModal";
import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

function BoardsModal() {
  const {
    openAddBoardModal,
    isAddBoardModalOpen,
    closeBoardsModal,
    isBoardsModalEntered,
  } = useModal();
  const { boards, currentBoard, setCurrentBoard, isLoading } = useBoards();

  const handleCloseSidebar = () => {
    // closeBoardsModal handles the animation timing via context
    closeBoardsModal();
  };

  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay (click to close) */}
      <div
        className="absolute inset-0 bg-black/50 md:bg-transparent"
        onClick={handleCloseSidebar}
      />

      {/* Mobile - centered modal */}
      <div className="bg-theme-surface absolute top-22 left-1/2 w-[264px] -translate-x-1/2 rounded-lg py-4 md:hidden">
        <h3 className="text-theme-secondary self-start pr-6 pb-[19px] pl-6 text-[12px] font-bold tracking-[2.4px] uppercase">
          All boards ({boards.length})
        </h3>
        <div>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p className="text-theme-secondary text-sm">Loading boards...</p>
            </div>
          ) : boards.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-theme-secondary text-center text-sm">
                No boards found. Create your first board to get started!
              </p>
              <button
                onClick={openAddBoardModal}
                className="bg-primary flex h-10 w-[180px] items-center justify-center rounded-3xl"
              >
                <span className="text-[14px] font-bold text-white">
                  + Create New Board
                </span>
              </button>
            </div>
          ) : (
            boards.map((board) => (
              <div
                key={board.id}
                className={`flex cursor-pointer gap-3 pt-[14px] pb-[15px] pl-6 hover:bg-gray-100 ${
                  currentBoard?.id === board.id
                    ? "bg-primary rounded-r-3xl"
                    : ""
                }`}
                onClick={() => {
                  setCurrentBoard(board);
                  closeBoardsModal();
                }}
              >
                <Image
                  className="object-none"
                  src="/icon-board.svg"
                  height={16}
                  width={16}
                  alt="board icon"
                />
                <p
                  className={`text-[15px] font-bold ${currentBoard?.id === board.id ? "text-white" : "text-theme-secondary"}`}
                >
                  {board.name}
                </p>
              </div>
            ))
          )}
          {boards.length > 0 && (
            <div
              className="flex cursor-pointer gap-3 pt-[14px] pb-[15px] pl-6 hover:bg-gray-100"
              onClick={openAddBoardModal}
            >
              <Image
                className="object-none"
                src="/icon-board.svg"
                height={16}
                width={16}
                alt="board icon"
              />
              <p className="text-theme-secondary text-[15px] font-bold">
                + Create New Board
              </p>
            </div>
          )}
          <div className="bg-theme-surface-secondary mt-4 flex h-[48px] w-[235px] items-center justify-center justify-self-center rounded-lg">
            <div className="flex h-5 w-[121px] justify-between">
              <Image
                className="object-none"
                src="/icon-light-theme.svg"
                alt="light theme icon"
                height={18}
                width={18}
              />
              <Toggle />
              <Image
                className="object-none"
                src="/icon-dark-theme.svg"
                alt="dark theme icon"
                height={18}
                width={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet+ - left sliding drawer */}
      <div
        className={`absolute top-0 left-0 z-70 hidden h-[100vh] w-[300px] transform border-r border-[#E4EBFA] bg-white transition-all duration-300 ease-out md:block ${
          isBoardsModalEntered
            ? "visible translate-x-0 opacity-100"
            : "invisible -translate-x-full opacity-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-[34px] pt-8">
            <button aria-label="Open boards" className="flex items-center">
              <Image
                src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
                alt="kanban logo"
                width={152}
                height={25}
                className="cursor-pointer"
              />
            </button>
            <h3 className="text-theme-secondary self-start pt-[54px] pr-6 pb-[19px] text-[12px] font-bold tracking-[2.4px] uppercase">
              All boards ({boards.length})
            </h3>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-[23px]">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <p className="text-theme-secondary text-sm">
                  Loading boards...
                </p>
              </div>
            ) : boards.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-theme-secondary text-center text-sm">
                  No boards found. Create your first board to get started!
                </p>
                <button
                  onClick={openAddBoardModal}
                  className="bg-primary flex h-10 w-[180px] items-center justify-center rounded-3xl"
                >
                  <span className="text-[14px] font-bold text-white">
                    + Create New Board
                  </span>
                </button>
              </div>
            ) : (
              boards.map((board) => (
                <div
                  key={board.id}
                  className={`flex cursor-pointer gap-3 pt-[14px] pb-[15px] pl-8 hover:bg-gray-100 ${
                    currentBoard?.id === board.id
                      ? "bg-primary rounded-r-3xl"
                      : ""
                  }`}
                  onClick={() => {
                    setCurrentBoard(board);
                    closeBoardsModal();
                  }}
                >
                  <Image
                    className="object-none"
                    src="/icon-board.svg"
                    height={16}
                    width={16}
                    alt="board icon"
                  />
                  <p
                    className={`text-[15px] font-bold ${currentBoard?.id === board.id ? "text-white" : "text-theme-secondary"}`}
                  >
                    {board.name}
                  </p>
                </div>
              ))
            )}
            {boards.length > 0 && (
              <div
                className="flex cursor-pointer gap-3 pt-[14px] pb-[15px] pl-8 hover:bg-gray-100"
                onClick={openAddBoardModal}
              >
                <Image
                  className="object-none"
                  src="/icon-board.svg"
                  height={16}
                  width={16}
                  alt="board icon"
                />
                <p className="text-primary text-[15px] font-bold">
                  + Create New Board
                </p>
              </div>
            )}
          </div>

          {/* Fixed bottom section */}
          <div className="border-theme p-4">
            <div className="bg-theme-surface-secondary flex h-[48px] items-center justify-center rounded-lg pr-6 pl-6">
              <div className="flex h-5 w-[121px] justify-between">
                <Image
                  className="object-none"
                  src="/icon-light-theme.svg"
                  alt="light theme icon"
                  height={18}
                  width={18}
                />
                <Toggle />
                <Image
                  className="object-none"
                  src="/icon-dark-theme.svg"
                  alt="dark theme icon"
                  height={18}
                  width={18}
                />
              </div>
            </div>

            {/* Hide Sidebar Option - Only visible on tablet+ */}
            <div className="mt-4 mr-4">
              <button
                onClick={handleCloseSidebar}
                className="flex w-full items-center gap-3 rounded-lg py-3 pl-3 text-left transition-colors hover:bg-gray-100"
              >
                <Image
                  src="/icon-hide-sidebar.svg"
                  alt="Hide sidebar"
                  width={16}
                  height={16}
                />
                <span className="text-theme-secondary text-[15px] font-bold">
                  Hide Sidebar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAddBoardModalOpen && <AddBoardModal />}
    </div>
  );
}

export default BoardsModal;
