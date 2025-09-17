"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ModalContextType {
  isTasksModalOpen: boolean;
  openTasksModal: () => void;
  closeTasksModal: () => void;

  isBoardsModalOpen: boolean;
  openBoardsModal: () => void;
  closeBoardsModal: () => void;
  toggleBoardsModal: () => void;

  isTaskDetailsModalOpen: boolean;
  openTaskDetailsModal: () => void;
  closeTaskDetailsModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isBoardsModalOpen, setIsBoardsModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);

  const openTasksModal = () => setIsTasksModalOpen(true);
  const closeTasksModal = () => setIsTasksModalOpen(false);

  const openTaskDetailsModal = () => setIsTaskDetailsModalOpen(true);
  const closeTaskDetailsModal = () => setIsTaskDetailsModalOpen(false);

  const openBoardsModal = () => setIsBoardsModalOpen(true);
  const closeBoardsModal = () => setIsBoardsModalOpen(false);
  const toggleBoardsModal = () => setIsBoardsModalOpen(!isBoardsModalOpen);

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
