/**
 * Modal Context Provider
 *
 * This context manages all modal-related state and operations in our kanban application.
 * It handles:
 * 1. Opening and closing various modals
 * 2. Managing selected items (tasks, boards) for modals
 * 3. Preventing background scroll when modals are open
 * 4. Centralized modal state management
 *
 * Key Features:
 * - Multiple modal types (task, board, column management)
 * - Selected item tracking for edit/delete operations
 * - Background scroll prevention
 * - Clean modal state management
 */

"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Subtask Interface
 *
 * Represents a smaller task within a main task.
 */
interface Subtask {
  id: string; // Unique identifier
  title: string; // Subtask description
  completed: boolean; // Completion status
  task_id: string; // Parent task ID
}

/**
 * Task Interface
 *
 * Represents a task in our kanban board with all its properties
 * and associated subtasks.
 */
interface Task {
  id: string; // Unique identifier
  title: string; // Task title
  description?: string; // Optional description
  column_id: string; // Which column the task belongs to
  board_id: string; // Which board the task belongs to
  created_at: string; // Creation timestamp
  updated_at: string; // Last update timestamp
  created_by_id: string; // User who created the task
  subtasks: Subtask[]; // Array of subtasks
}

/**
 * Board Column Interface
 *
 * Represents a column within a board (e.g., "To Do", "In Progress", "Done").
 */
interface BoardColumn {
  id: string; // Unique identifier
  name: string; // Column name
  board_id: string; // Parent board ID
  created_at: string; // Creation timestamp
}

/**
 * Board Interface
 *
 * Represents a complete kanban board with its columns.
 */
interface Board {
  id: string; // Unique identifier
  name: string; // Board name
  created_at: string; // Creation timestamp
  updated_at: string; // Last update timestamp
  board_columns: BoardColumn[]; // Array of columns in this board
}

/**
 * Modal Context Type
 *
 * Defines the shape of the context value that will be provided
 * to all consuming components. This includes all modal states
 * and functions to control them.
 */
interface ModalContextType {
  // Task-related modals
  isTasksModalOpen: boolean; // Add new task modal
  openTasksModal: () => void;
  closeTasksModal: () => void;

  // Board navigation modal
  isBoardsModalOpen: boolean; // Board selection sidebar
  openBoardsModal: () => void;
  closeBoardsModal: () => void;
  toggleBoardsModal: () => void;

  // Task details modal
  isTaskDetailsModalOpen: boolean; // View task details
  openTaskDetailsModal: (task: Task) => void;
  closeTaskDetailsModal: () => void;

  // Edit task modal
  isEditTaskModalOpen: boolean; // Edit existing task
  openEditTaskModal: (task: Task) => void;
  closeEditTaskModal: () => void;
  selectedTask: Task | null; // Currently selected task for editing
  updateSelectedTask: (task: Task) => void;

  // Delete task modal
  isDeleteTaskModalOpen: boolean; // Delete task confirmation
  openDeleteTaskModal: (task: Task) => void;
  closeDeleteTaskModal: () => void;

  // Add board modal
  isAddBoardModalOpen: boolean; // Create new board
  openAddBoardModal: () => void;
  closeAddBoardModal: () => void;

  // Edit board modal
  isEditBoardModalOpen: boolean; // Edit existing board
  openEditBoardModal: (board: Board) => void;
  closeEditBoardModal: () => void;
  selectedBoardForEdit: Board | null; // Currently selected board for editing

  // Delete board modal
  isDeleteBoardModalOpen: boolean; // Delete board confirmation
  openDeleteBoardModal: (board: Board) => void;
  closeDeleteBoardModal: () => void;
  selectedBoard: Board | null; // Currently selected board for deletion

  // Add column modal
  isAddColumnModalOpen: boolean; // Add new column to board
  openAddColumnModal: () => void;
  closeAddColumnModal: () => void;
}

// Create the context with undefined as default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Modal Provider Component
 *
 * This component provides modal-related state and functions to all child components.
 * It manages all modal states and prevents background scrolling when modals are open.
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  // Modal state management - each modal has its own boolean state
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isBoardsModalOpen, setIsBoardsModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [selectedBoardForEdit, setSelectedBoardForEdit] =
    useState<Board | null>(null);
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  // Task modal functions
  const openTasksModal = () => setIsTasksModalOpen(true);
  const closeTasksModal = () => setIsTasksModalOpen(false);

  // Task details modal functions
  const openTaskDetailsModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsModalOpen(true);
  };
  const closeTaskDetailsModal = () => setIsTaskDetailsModalOpen(false);

  // Board modal functions
  const openBoardsModal = () => setIsBoardsModalOpen(true);
  const closeBoardsModal = () => setIsBoardsModalOpen(false);
  const toggleBoardsModal = () => setIsBoardsModalOpen(!isBoardsModalOpen);

  // Edit task modal functions
  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };
  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
  };

  // Delete task modal functions
  const openDeleteTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteTaskModalOpen(true);
  };
  const closeDeleteTaskModal = () => setIsDeleteTaskModalOpen(false);

  // Add board modal functions
  const openAddBoardModal = () => setIsAddBoardModalOpen(true);
  const closeAddBoardModal = () => setIsAddBoardModalOpen(false);

  // Edit board modal functions
  const openEditBoardModal = (board: Board) => {
    setSelectedBoardForEdit(board);
    setIsEditBoardModalOpen(true);
  };
  const closeEditBoardModal = () => {
    setIsEditBoardModalOpen(false);
    setSelectedBoardForEdit(null);
  };

  // Delete board modal functions
  const openDeleteBoardModal = (board: Board) => {
    setSelectedBoard(board);
    setIsDeleteBoardModalOpen(true);
  };
  const closeDeleteBoardModal = () => setIsDeleteBoardModalOpen(false);

  // Add column modal functions
  const openAddColumnModal = () => setIsAddColumnModalOpen(true);
  const closeAddColumnModal = () => setIsAddColumnModalOpen(false);

  // Update selected task (used when task is modified)
  const updateSelectedTask = (task: Task) => {
    setSelectedTask(task);
  };

  /**
   * Prevent background scroll when any modal is open
   *
   * This effect runs whenever any modal state changes. It:
   * 1. Adds overflow-hidden to the body to prevent scrolling
   * 2. Compensates for the scrollbar width to prevent layout shift
   * 3. Cleans up when the component unmounts
   */
  useEffect(() => {
    const isAnyModalOpen =
      isTasksModalOpen ||
      isBoardsModalOpen ||
      isTaskDetailsModalOpen ||
      isEditTaskModalOpen ||
      isDeleteTaskModalOpen ||
      isAddBoardModalOpen ||
      isEditBoardModalOpen ||
      isDeleteBoardModalOpen ||
      isAddColumnModalOpen;

    const body = document.body;
    if (isAnyModalOpen) {
      // Calculate scrollbar width to prevent layout shift
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      body.classList.add("overflow-hidden");
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      body.classList.remove("overflow-hidden");
      body.style.paddingRight = "";
    }

    // Cleanup function to ensure we don't leave the body in a bad state
    return () => {
      body.classList.remove("overflow-hidden");
      body.style.paddingRight = "";
    };
  }, [
    isTasksModalOpen,
    isBoardsModalOpen,
    isTaskDetailsModalOpen,
    isEditTaskModalOpen,
    isDeleteTaskModalOpen,
    isAddBoardModalOpen,
    isEditBoardModalOpen,
    isDeleteBoardModalOpen,
    isAddColumnModalOpen,
  ]);

  // Provide the context value to all child components
  return (
    <ModalContext.Provider
      value={{
        isTasksModalOpen,
        openTasksModal,
        closeTasksModal,
        isBoardsModalOpen,
        openBoardsModal,
        closeBoardsModal,
        toggleBoardsModal,
        isTaskDetailsModalOpen,
        openTaskDetailsModal,
        closeTaskDetailsModal,
        isEditTaskModalOpen,
        openEditTaskModal,
        closeEditTaskModal,
        selectedTask,
        updateSelectedTask,
        isDeleteTaskModalOpen,
        openDeleteTaskModal,
        closeDeleteTaskModal,
        isAddBoardModalOpen,
        openAddBoardModal,
        closeAddBoardModal,
        isEditBoardModalOpen,
        openEditBoardModal,
        closeEditBoardModal,
        selectedBoardForEdit,
        isDeleteBoardModalOpen,
        openDeleteBoardModal,
        closeDeleteBoardModal,
        selectedBoard,
        isAddColumnModalOpen,
        openAddColumnModal,
        closeAddColumnModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Custom hook to use the Modal context
 *
 * This hook provides easy access to the modal context. It includes
 * error handling to ensure the hook is only used within a ModalProvider.
 *
 * @returns The modal context value
 * @throws Error if used outside of ModalProvider
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}
