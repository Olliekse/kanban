"use client";

import Image from "next/image";
import { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";
import Button from "./Button";

function TaskDetailsModal() {
  const {
    selectedTask,
    closeTaskDetailsModal,
    openEditTaskModal,
    openDeleteTaskModal,
    updateSelectedTask,
  } = useModal();
  const { refreshTasks } = useTasks();
  const { currentBoard } = useBoards();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!selectedTask) return null;

  const completedCount =
    selectedTask.subtasks?.filter((s) => s.completed).length ?? 0;
  const totalCount = selectedTask.subtasks?.length ?? 0;

  const handleSubtaskToggle = async (
    subtaskId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subtask");
      }

      // Update the selected task immediately for real-time UI update
      const updatedSubtasks = selectedTask.subtasks?.map((s) =>
        s.id === subtaskId ? { ...s, completed: !currentStatus } : s,
      );

      // Update the selected task in context immediately
      const updatedTask = { ...selectedTask, subtasks: updatedSubtasks };
      updateSelectedTask(updatedTask);

      // Also refresh the tasks list for consistency
      await refreshTasks();
    } catch (error) {
      console.error("Error updating subtask:", error);
      alert("Failed to update subtask. Please try again.");
    }
  };

  const handleDelete = () => openDeleteTaskModal(selectedTask);

  const handleEdit = () => {
    setMenuOpen(false);
    closeTaskDetailsModal();
    openEditTaskModal(selectedTask);
  };

  return (
    <div
      onClick={closeTaskDetailsModal}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-theme-surface relative mx-4 w-full max-w-[480px] rounded-lg px-4 py-6"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <h3 className="heading-l text-primary">{selectedTask.title}</h3>
            <div className="relative">
              <button
                aria-label="Task actions"
                onClick={() => setMenuOpen((o) => !o)}
                className="cursor-pointer"
              >
                <Image
                  className="lg:h-5 lg:w-[5px]"
                  src="/icon-vertical-ellipsis.svg"
                  alt="3-dot menu icon"
                  width={4}
                  height={16}
                />
              </button>
              {menuOpen && (
                <div className="bg-theme-surface absolute right-0 z-10 mt-2 w-40 rounded-md p-2 shadow-lg">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEdit}
                    className="w-full justify-start !rounded-md !py-2 !text-[#828FA3]"
                  >
                    Edit Task
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="w-full justify-start !rounded-md !py-2"
                  >
                    Delete Task
                  </Button>
                </div>
              )}
            </div>
          </div>
          {selectedTask.description && (
            <p className="body-l text-secondary">{selectedTask.description}</p>
          )}
          <span className="heading-s text-secondary">
            Subtasks ({completedCount} of {totalCount})
          </span>
        </div>
        <div className="mt-4 mb-6 flex flex-col gap-2">
          {selectedTask.subtasks?.map((s) => (
            <div
              key={s.id}
              className="bg-theme-secondary hover:bg-theme-subtask-button flex gap-4 rounded p-3 transition-colors"
            >
              <input
                type="checkbox"
                checked={s.completed}
                onChange={() => handleSubtaskToggle(s.id, s.completed)}
                className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-2 border-gray-300 bg-white"
                style={{ accentColor: "var(--color-primary)" }}
              />
              <p
                className={`heading-s ${
                  s.completed
                    ? "text-theme-secondary line-through"
                    : "text-theme-primary"
                }`}
              >
                {s.title}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="heading-s text-secondary">Current status</span>
          <div className="relative mb-6">
            <select
              value={selectedTask.column_id}
              disabled
              className="border-theme-secondary/25 text-theme-primary w-full cursor-not-allowed appearance-none rounded border px-4 py-2 pr-10 opacity-80"
            >
              {currentBoard?.board_columns?.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              )) || []}
            </select>
            <Image
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
              src="/icon-chevron-down.svg"
              width={9}
              height={5}
              alt="dropdown arrow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
