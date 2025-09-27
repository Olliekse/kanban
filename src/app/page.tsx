/**
 * Main Kanban Board Page Component
 *
 * This is the heart of our kanban application. It renders:
 * 1. A drag-and-drop kanban board with columns and tasks
 * 2. Loading states and empty states
 * 3. All modal components for task/board management
 * 4. Responsive design that adapts to different screen sizes
 *
 * Key Features:
 * - Drag and drop functionality using @hello-pangea/dnd
 * - Real-time task updates
 * - Responsive grid layout
 * - Color-coded columns
 * - Task count indicators
 */

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
import EditBoardModal from "@/components/EditBoardModal";
import AddColumnModal from "@/components/AddColumnModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Home() {
  // Custom hooks to access shared state from context providers
  const { tasks, isLoading, onDragEnd } = useTasks();
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
    isEditBoardModalOpen,
    isAddColumnModalOpen,
    openAddColumnModal,
    isBoardsModalEntered,
  } = useModal();

  /**
   * Helper function to filter tasks by column
   *
   * This function takes a column ID and returns all tasks that belong to that column.
   * It's used to display the correct tasks in each column of our kanban board.
   *
   * @param columnId - The ID of the column to filter tasks for
   * @returns Array of tasks belonging to the specified column
   */
  const getTasksByColumn = (columnId: string) => {
    return tasks.filter((task) => task.column_id === columnId);
  };

  // Loading state - show a spinner while tasks are being fetched
  if (isLoading) {
    return (
      <div className="bg-theme-secondary text-theme-secondary flex h-[100vh] flex-col items-center justify-center px-4 text-center text-[18px] font-bold">
        <div className="flex flex-col items-center gap-[25px]">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Empty state - show when no board is selected
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

        {/* 
          Include all modals even in empty state
          This ensures modals work properly when no board is selected
        */}
        {isBoardsModalOpen && <BoardsModal />}
        {isAddBoardModalOpen && <AddBoardModal />}
        {isEditBoardModalOpen && <EditBoardModal />}
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
  // These colors help visually distinguish between different columns
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={`bg-theme-secondary min-h-screen px-4 py-5 transition-[padding] duration-300 md:px-6 ${
          isBoardsModalEntered ? "md:pl-[320px]" : ""
        }`}
      >
        {/* 
          Main kanban board grid
          Uses CSS Grid with dynamic columns based on the number of board columns
          The +1 accounts for the "New Column" button
        */}
        <div
          className={`grid gap-[22px] overflow-x-auto md:gap-6`}
          style={{
            gridTemplateColumns: `repeat(${(currentBoard.board_columns?.length || 0) + 1}, 280px)`,
          }}
        >
          {/* 
            Render each column in the current board
            Each column shows its name, task count, and contains droppable tasks
          */}
          {currentBoard.board_columns?.map((column, index) => (
            <div key={column.id} className="">
              {/* Column header with color indicator and task count */}
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

              {/* 
                Droppable area for tasks
                This is where tasks can be dropped when dragged from other columns
                The snapshot provides visual feedback during drag operations
              */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] space-y-3 transition-colors duration-200 ${
                      snapshot.isDraggingOver
                        ? "rounded-lg bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    {/* 
                      Render each task in this column
                      Tasks are draggable and clickable to open details modal
                    */}
                    {getTasksByColumn(column.id).map((task, taskIndex) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={taskIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => openTaskDetailsModal(task)}
                            className={`bg-theme-surface cursor-pointer rounded-lg p-4 shadow-sm transition-all duration-200 md:p-5 ${
                              snapshot.isDragging
                                ? "scale-105 rotate-3 shadow-2xl"
                                : "hover:scale-[1.02] hover:shadow-md"
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            {/* Task title */}
                            <h3 className="text-theme-primary font-semibold">
                              {task.title}
                            </h3>

                            {/* Task description (if provided) */}
                            {task.description && (
                              <p className="text-theme-secondary mt-2 text-sm">
                                {task.description}
                              </p>
                            )}

                            {/* Subtask progress indicator */}
                            {task.subtasks.length > 0 && (
                              <div className="mt-3">
                                <p className="text-theme-secondary text-xs">
                                  {
                                    task.subtasks.filter((s) => s.completed)
                                      .length
                                  }{" "}
                                  of {task.subtasks.length} subtasks
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* Placeholder for drag and drop - maintains spacing during drag */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}

          {/* 
            "New Column" button
            Allows users to add new columns to the current board
            Positioned at the end of the grid
          */}
          <div className="flex h-[calc(100vh-200px)] min-h-[400px] items-center justify-center">
            <button
              onClick={openAddColumnModal}
              className="bg-theme-new-column hover:bg-theme-secondary text-theme-secondary hover:text-theme-primary mt-[63px] flex h-full w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 md:h-[814px]"
            >
              <span className="text-[24px] font-bold">+ New Column</span>
            </button>
          </div>
        </div>

        {/* 
          Show Sidebar Button
          Only visible on tablet+ screens when the sidebar is closed
          Provides a way to reopen the sidebar for board navigation
        */}
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

        {/* 
          Modal Components
          All modals are conditionally rendered based on their respective state
          They overlay the main content and handle various user interactions
        */}
        {isBoardsModalOpen && <BoardsModal />}
        {isTaskDetailsModalOpen && <TaskDetailsModal />}
        {isEditTaskModalOpen && <EditTaskModal />}
        {isTasksModalOpen && <TaskModal />}
        {isDeleteTaskModalOpen && <DeleteTaskModal />}
        {isDeleteBoardModalOpen && <DeleteBoardModal />}
        {isAddBoardModalOpen && <AddBoardModal />}
        {isEditBoardModalOpen && <EditBoardModal />}
        {isAddColumnModalOpen && <AddColumnModal />}
      </div>
    </DragDropContext>
  );
}
