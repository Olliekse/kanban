"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useModal } from "@/contexts/ModalContext";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";
import Button from "./Button";

interface SubtaskFormValue {
  id?: string;
  title: string;
  completed?: boolean;
}

export default function EditTaskModal() {
  const { selectedTask, closeEditTaskModal } = useModal();
  const { refreshTasks } = useTasks();
  const { currentBoard } = useBoards();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState("");
  const [subtasks, setSubtasks] = useState<SubtaskFormValue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hydrate form with selected task
  useEffect(() => {
    if (!selectedTask) return;
    setTitle(selectedTask.title ?? "");
    setDescription(selectedTask.description ?? "");
    setColumnId(selectedTask.column_id ?? "");
    setSubtasks(
      (selectedTask.subtasks ?? []).map((s: any) => ({
        id: s.id,
        title: s.title ?? "",
        completed: Boolean(s.completed),
      })),
    );
  }, [selectedTask]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addSubtask = () => setSubtasks((prev) => [...prev, { title: "" }]);
  const removeSubtask = (index: number) =>
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  const updateSubtask = (index: number, title: string) =>
    setSubtasks((prev) =>
      prev.map((s, i) => (i === index ? { ...s, title } : s)),
    );

  const handleColumnSelect = (columnId: string) => {
    setColumnId(columnId);
    setIsDropdownOpen(false);
  };

  const getSelectedColumnName = () => {
    const selectedColumn = currentBoard?.board_columns?.find(
      (col) => col.id === columnId,
    );
    return selectedColumn?.name || "Select a column";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setIsLoading(true);

    try {
      // Update core task fields first
      const taskResponse = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          column_id: columnId,
        }),
      });

      if (!taskResponse.ok) {
        const errorData = (await taskResponse.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to update task");
      }

      // Then update subtasks using the batch endpoint
      const subtasksResponse = await fetch(`/api/subtasks/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selectedTask.id,
          subtasks: subtasks.map((subtask) => ({
            title: subtask.title,
            completed: subtask.completed ?? false,
            task_id: selectedTask.id,
          })),
        }),
      });

      if (!subtasksResponse.ok) {
        const errorData = (await subtasksResponse.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to update subtasks");
      }

      await refreshTasks(currentBoard?.id);
      closeEditTaskModal();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedTask) return null;

  // Don't render if no current board or no columns
  if (
    !currentBoard ||
    !currentBoard.board_columns ||
    currentBoard.board_columns.length === 0
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-theme-surface relative mx-4 w-full max-w-[343px] rounded-lg p-6 md:max-w-[480px]">
        <h2 className="heading-l pb-6">Edit Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="heading-s text-theme-label pb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="placeholder:text-theme-secondary/50 border-theme text-theme-primary bg-theme-surface focus:border-primary w-full rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium focus:outline-none"
            placeholder="e.g. Take coffee break"
            required
          />

          <label className="heading-s text-theme-label pt-6 pb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="placeholder:text-theme-secondary/50 border-theme text-theme-primary bg-theme-surface focus:border-primary h-[112px] w-full resize-none rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium focus:outline-none"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />

          <label className="heading-s text-theme-label pt-6 pb-2">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => (
            <div
              key={subtask.id ?? index}
              className="mb-3 flex justify-between"
            >
              <input
                type="text"
                value={subtask.title}
                onChange={(e) => updateSubtask(index, e.target.value)}
                className="placeholder:text-theme-secondary/50 border-theme text-theme-primary bg-theme-surface focus:border-primary w-full rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium focus:outline-none"
                placeholder="e.g. Make coffee"
              />
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="ml-4 h-8 w-8 bg-transparent p-0 hover:bg-transparent"
              >
                <Image
                  src="/icon-cross.svg"
                  alt="Remove subtask"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </button>
            </div>
          ))}

          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={addSubtask}
            className="bg-theme-subtask-button !text-primary hover:!bg-primary/20 mb-6"
          >
            + Add New Subtask
          </Button>

          <label className="heading-s text-theme-label pb-2">Status</label>
          <div className="relative mb-6" ref={dropdownRef}>
            {/* Custom dropdown button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="!bg-theme-surface !border-primary !text-theme-primary flex w-full items-center justify-between !rounded !border !px-4 !py-3 text-left"
            >
              <span>{getSelectedColumnName()}</span>
              <svg
                className={`text-primary h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="#635FC7"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Custom dropdown menu */}
            {isDropdownOpen && (
              <div className="bg-theme-surface absolute top-full right-0 left-0 z-10 mt-1 rounded-xl shadow-lg">
                {currentBoard?.board_columns?.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() => handleColumnSelect(column.id)}
                    className={`!bg-theme-surface hover:!bg-theme-secondary w-full !rounded-none px-4 !py-3 text-left first:!rounded-t-xl last:!rounded-b-xl ${
                      columnId === column.id
                        ? "!text-theme-primary font-medium"
                        : "!text-theme-primary"
                    }`}
                  >
                    {column.name}
                  </button>
                )) || []}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
