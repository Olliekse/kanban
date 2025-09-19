"use client";

import Image from "next/image";
import TaskModal from "@/components/AddTaskModal";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useModal } from "@/contexts/ModalContext";
import BoardsModal from "@/components/BoardsModal";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import EditTaskModal from "@/components/EditTaskModal";
import DeleteTaskModal from "@/components/DeleteTaskModal";
import DeleteBoardModal from "@/components/DeleteBoardModal";
import AddBoardModal from "@/components/AddBoardModal";
import AddColumnModal from "@/components/AddColumnModal";

export default function Home() {
  const { tasks, isLoading } = useTasks();
  const { currentBoard } = useBoards();
  const {
    openTasksModal,
    isTasksModalOpen,
    isBoardsModalOpen,
    openBoardsModal,
    isTaskDetailsModalOpen,
    openTaskDetailsModal,
    isEditTaskModalOpen,
    openEditTaskModal,
    isDeleteTaskModalOpen,
    isDeleteBoardModalOpen,
    isAddBoardModalOpen,
    isAddColumnModalOpen,
    openAddColumnModal,
  } = useModal();

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter((task) => task.column_id === columnId);
  };

  if (isLoading) {
    return (
      <div className="bg-theme-secondary text-theme-secondary flex h-[100vh] flex-col items-center justify-center px-4 text-center text-[18px] font-bold">
        <div className="flex flex-col items-center gap-[25px]">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="bg-theme-secondary text-theme-secondary flex h-[100vh] flex-col items-center justify-center px-4 text-center text-[18px] font-bold">
        <div className="flex flex-col items-center gap-[25px]">
          <p>No board selected. Please select a board to view tasks.</p>
          <button
            onClick={openBoardsModal}
            className="bg-primary flex h-12 w-[200px] items-center justify-center rounded-3xl"
          >
            <span className="text-[15px] font-bold text-white">
              Select Board
            </span>
          </button>
        </div>

        {/* Include all modals */}
        {isBoardsModalOpen && <BoardsModal />}
        {isAddBoardModalOpen && <AddBoardModal />}
        {isAddColumnModalOpen && <AddColumnModal />}
        {isTasksModalOpen && <TaskModal />}
        {isTaskDetailsModalOpen && <TaskDetailsModal />}
        {isEditTaskModalOpen && <EditTaskModal />}
        {isDeleteTaskModalOpen && <DeleteTaskModal />}
        {isDeleteBoardModalOpen && <DeleteBoardModal />}
      </div>
    );
  }

  // Define colors for column indicators
  const columnColors = [
    "#49C4E5", // Light blue
    "#8471F2", // Purple
    "#67E2AE", // Green
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Mint
    "#FFEAA7", // Yellow
  ];

  return (
    <div
      className={`bg-theme-secondary min-h-screen px-4 py-6 transition-[padding] duration-300 md:px-6 lg:px-8 ${
        isBoardsModalOpen ? "md:pl-[289px]" : ""
      }`}
    >
      <div
        className={`grid gap-4 overflow-x-auto md:gap-6`}
        style={{
          gridTemplateColumns: `repeat(${(currentBoard.board_columns?.length || 0) + 1}, 280px)`,
        }}
      >
        {currentBoard.board_columns?.map((column, index) => (
          <div key={column.id} className="">
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <div
                className="h-[15px] w-[15px] rounded-xl"
                style={{
                  backgroundColor: columnColors[index % columnColors.length],
                }}
              ></div>
              <h2 className="text-theme-secondary font-[Plus_Jakarta_Sans] text-[12px] font-bold tracking-[2.4px] uppercase">
                {column.name} ({getTasksByColumn(column.id).length})
              </h2>
            </div>
            <div className="space-y-3">
              {getTasksByColumn(column.id).map((task) => (
                <div
                  key={task.id}
                  onClick={() => openTaskDetailsModal(task)}
                  className="bg-theme-surface cursor-pointer rounded-lg p-4 shadow-sm md:p-5"
                >
                  <h3 className="text-theme-primary font-semibold">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-theme-secondary mt-2 text-sm">
                      {task.description}
                    </p>
                  )}
                  {task.subtasks.length > 0 && (
                    <div className="mt-3">
                      <p className="text-theme-secondary text-xs">
                        {task.subtasks.filter((s) => s.completed).length} of{" "}
                        {task.subtasks.length} subtasks
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* New Column Button */}
        <div className="flex h-[calc(100vh-200px)] min-h-[400px] items-center justify-center">
          <button
            onClick={openAddColumnModal}
            className="bg-theme-new-column hover:bg-theme-secondary text-theme-secondary hover:text-theme-primary flex h-full w-full items-center justify-center rounded-lg transition-colors duration-200"
          >
            <span className="text-[24px] font-bold">+ New Column</span>
          </button>
        </div>
      </div>

      {/* Show Sidebar Button - Only visible on tablet+ when sidebar is closed */}
      {!isBoardsModalOpen && (
        <button
          onClick={openBoardsModal}
          className="bg-primary fixed bottom-8 left-8 hidden h-12 w-14 items-center justify-center rounded-r-3xl md:flex"
          aria-label="Show sidebar"
        >
          <Image
            src="/icon-show-sidebar.svg"
            alt="Show sidebar"
            width={16}
            height={11}
          />
        </button>
      )}

      {/* Modals */}
      {isBoardsModalOpen && <BoardsModal />}
      {isTaskDetailsModalOpen && <TaskDetailsModal />}
      {isEditTaskModalOpen && <EditTaskModal />}
      {isTasksModalOpen && <TaskModal />}
      {isDeleteTaskModalOpen && <DeleteTaskModal />}
      {isDeleteBoardModalOpen && <DeleteBoardModal />}
      {isAddBoardModalOpen && <AddBoardModal />}
      {isAddColumnModalOpen && <AddColumnModal />}
    </div>
  );
}
