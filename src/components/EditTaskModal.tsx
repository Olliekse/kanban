"use client";

import { useEffect, useState } from "react";
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

  const addSubtask = () => setSubtasks((prev) => [...prev, { title: "" }]);
  const removeSubtask = (index: number) =>
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  const updateSubtask = (index: number, title: string) =>
    setSubtasks((prev) =>
      prev.map((s, i) => (i === index ? { ...s, title } : s)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setIsLoading(true);

    try {
      // Update core task fields
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          column_id: columnId,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to update task");
      }

      // Note: For simplicity, subtasks editing (create/update/delete) is not
      // implemented in the API yet. We keep the UI parity for now.

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
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6">
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
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className="border-light-text-secondary/25 mb-6 w-full cursor-pointer appearance-none rounded border bg-white px-4 py-2"
            required
          >
            <option value="">Select a column</option>
            {currentBoard?.board_columns?.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            )) || []}
          </select>

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
