"use client";

import Image from "next/image";
import { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";

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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <h3 className="text-[18px] font-bold text-[#000112]">
              {selectedTask.title}
            </h3>
            <div className="relative">
              <button
                aria-label="Task actions"
                onClick={() => setMenuOpen((o) => !o)}
                className="cursor-pointer"
              >
                <Image
                  src="/icon-vertical-ellipsis.svg"
                  alt="3-dot menu icon"
                  width={4}
                  height={16}
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white p-2 shadow-lg">
                  <button
                    className="w-full rounded px-3 py-2 text-left text-[13px] font-medium hover:bg-gray-100"
                    onClick={handleEdit}
                  >
                    Edit Task
                  </button>
                  <button
                    className="w-full rounded px-3 py-2 text-left text-[13px] font-medium text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          </div>
          {selectedTask.description && (
            <p className="text-light-text-secondary text-[13px] leading-[23px] font-medium">
              {selectedTask.description}
            </p>
          )}
          <span className="text-light-text-secondary text-[12px] font-bold">
            Subtasks ({completedCount} of {totalCount})
          </span>
        </div>
        <div className="mt-4 mb-6 flex flex-col gap-2">
          {selectedTask.subtasks?.map((s) => (
            <div key={s.id} className="flex gap-4 bg-[#f4f7fd] p-3">
              <input
                type="checkbox"
                checked={s.completed}
                onChange={() => handleSubtaskToggle(s.id, s.completed)}
                className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                style={{ accentColor: "var(--color-primary)" }}
              />
              <p
                className={`text-[12px] font-bold ${
                  s.completed ? "text-gray-400 line-through" : "text-[#000112]"
                }`}
              >
                {s.title}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-light-text-secondary text-[12px] font-bold">
            Current status
          </span>
          <div className="relative mb-6">
            <select
              value={selectedTask.column_id}
              disabled
              className="border-light-text-secondary/25 w-full cursor-not-allowed appearance-none rounded border px-4 py-2 pr-10 opacity-80"
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
