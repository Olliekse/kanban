"use client";

import TaskModal from "@/components/AddTaskModal";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useModal } from "@/contexts/ModalContext";
import BoardsModal from "@/components/BoardsModal";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import EditTaskModal from "@/components/EditTaskModal";
import DeleteTaskModal from "@/components/DeleteTaskModal";
import AddBoardModal from "@/components/AddBoardModal";

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
    isAddBoardModalOpen,
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
        {isTasksModalOpen && <TaskModal />}
        {isTaskDetailsModalOpen && <TaskDetailsModal />}
        {isEditTaskModalOpen && <EditTaskModal />}
        {isDeleteTaskModalOpen && <DeleteTaskModal />}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-theme-secondary text-theme-secondary flex h-[100vh] flex-col items-center justify-center px-4 text-center text-[18px] font-bold">
        <div className="flex flex-col items-center gap-[25px]">
          <p>This board is empty. Create a new task to get started.</p>
          <button
            onClick={() => openTasksModal()}
            className="bg-primary flex h-12 w-[174px] items-center justify-center rounded-3xl"
          >
            <span className="text-[15px] font-bold text-white">
              + Add new task
            </span>
          </button>
        </div>

        <TaskModal />
        {isAddBoardModalOpen && <AddBoardModal />}
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
    <div className="bg-theme-secondary min-h-screen p-6">
      <div
        className={`grid gap-6 overflow-x-auto`}
        style={{
          gridTemplateColumns: `repeat(${currentBoard.board_columns?.length || 0}, 280px)`,
        }}
      >
        {currentBoard.board_columns?.map((column, index) => (
          <div key={column.id} className="">
            <div className="mb-4 flex items-center gap-3">
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
                  className="bg-theme-surface cursor-pointer rounded-lg p-4 shadow-sm"
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
      </div>

      {/* Modals */}
      {isBoardsModalOpen && <BoardsModal />}
      {isTaskDetailsModalOpen && <TaskDetailsModal />}
      {isEditTaskModalOpen && <EditTaskModal />}
      {isTasksModalOpen && <TaskModal />}
      {isDeleteTaskModalOpen && <DeleteTaskModal />}
      {isAddBoardModalOpen && <AddBoardModal />}
    </div>
  );
}
