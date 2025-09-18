"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  task_id: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  column_id: string;
  board_id: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  subtasks: Subtask[];
}

interface ModalContextType {
  isTasksModalOpen: boolean;
  openTasksModal: () => void;
  closeTasksModal: () => void;

  isBoardsModalOpen: boolean;
  openBoardsModal: () => void;
  closeBoardsModal: () => void;
  toggleBoardsModal: () => void;

  isTaskDetailsModalOpen: boolean;
  openTaskDetailsModal: (task: Task) => void;
  closeTaskDetailsModal: () => void;

  // Edit Task modal
  isEditTaskModalOpen: boolean;
  openEditTaskModal: (task: Task) => void;
  closeEditTaskModal: () => void;
  selectedTask: Task | null;
  updateSelectedTask: (task: Task) => void;

  // Delete Task modal
  isDeleteTaskModalOpen: boolean;
  openDeleteTaskModal: (task: Task) => void;
  closeDeleteTaskModal: () => void;

  // Add Board modal
  isAddBoardModalOpen: boolean;
  openAddBoardModal: () => void;
  closeAddBoardModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isBoardsModalOpen, setIsBoardsModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);

  const openTasksModal = () => setIsTasksModalOpen(true);
  const closeTasksModal = () => setIsTasksModalOpen(false);

  const openTaskDetailsModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsModalOpen(true);
  };
  const closeTaskDetailsModal = () => setIsTaskDetailsModalOpen(false);

  const openBoardsModal = () => setIsBoardsModalOpen(true);
  const closeBoardsModal = () => setIsBoardsModalOpen(false);
  const toggleBoardsModal = () => setIsBoardsModalOpen(!isBoardsModalOpen);

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };
  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
  };

  const openDeleteTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteTaskModalOpen(true);
  };
  const closeDeleteTaskModal = () => setIsDeleteTaskModalOpen(false);

  const openAddBoardModal = () => setIsAddBoardModalOpen(true);
  const closeAddBoardModal = () => setIsAddBoardModalOpen(false);

  const updateSelectedTask = (task: Task) => {
    setSelectedTask(task);
  };

  // Prevent background scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      isTasksModalOpen ||
      isBoardsModalOpen ||
      isTaskDetailsModalOpen ||
      isEditTaskModalOpen ||
      isDeleteTaskModalOpen ||
      isAddBoardModalOpen;

    const body = document.body;
    if (isAnyModalOpen) {
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
  ]);

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
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}
