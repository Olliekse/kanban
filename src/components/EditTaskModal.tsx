"use client";

import { useEffect, useState, useRef } from "react";
import { useModal } from "@/contexts/ModalContext";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";

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
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6 md:max-w-[480px]">
        <h2 className="pb-6 text-lg font-bold">Edit Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-3 text-light-text-secondary pb-2 font-bold">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="placeholder:text-dark-bg/25 w-full rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
            placeholder="e.g. Take coffee break"
            required
          />

          <label className="text-3 text-light-text-secondary pt-6 pb-2 font-bold">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="placeholder:text-dark-bg/25 h-[112px] w-full resize-none rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />

          <label className="text-3 text-light-text-secondary pt-6 pb-2 font-bold">
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
                className="placeholder:text-dark-bg/25 w-full rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
                placeholder="e.g. Make coffee"
              />
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="ml-4 cursor-pointer text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubtask}
            className="bg-primary/10 text-primary mb-6 h-10 cursor-pointer rounded-3xl font-bold"
          >
            + Add New Subtask
          </button>

          <label className="text-3 text-light-text-secondary pb-2 font-bold">
            Status
          </label>
          <div className="relative mb-6" ref={dropdownRef}>
            {/* Custom dropdown button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-left text-gray-500 focus:outline-none"
            >
              {getSelectedColumnName()}
            </button>

            {/* Dropdown arrow icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Custom dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg">
                {currentBoard?.board_columns?.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() => handleColumnSelect(column.id)}
                    className={`w-full px-4 py-3 text-left first:rounded-t-xl last:rounded-b-xl hover:bg-gray-50 ${
                      columnId === column.id
                        ? "font-medium text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {column.name}
                  </button>
                )) || []}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary mt-6 h-10 cursor-pointer rounded-3xl font-bold text-white disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
