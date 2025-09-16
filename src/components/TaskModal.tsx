"use client";

import { useModal } from "@/contexts/ModalContext";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  created_at: string;
  updated_at: string;
  created_by_id: string;
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  task_id: string;
}


export default function TaskModal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [subtasks, setSubtasks] = useState([{ title: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  const {openTasksModal, closeTasksModal} = useModal();

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "" }]);
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const updateSubtask = (index: number, title: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = { title };
    setSubtasks(newSubtasks);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Submitting task with:", {
        title,
        description,
        status,
        subtasks,
      });

      const taskData = {
        title: title.trim(),
        description: description.trim() || "",
        status: status as "todo" | "in-progress" | "done",
        subtasks: subtasks
          .filter((subtask) => subtask.title.trim() !== "")
          .map((subtask) => ({ title: subtask.title.trim() })),
      };

      console.log("Sending to API:", taskData);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to create task");
      }

      const createdTask = (await response.json()) as Task;
      console.log("Task created successfully:", createdTask);

      // Reset form and close modal
      setTitle("");
      setDescription("");
      setStatus("todo");
      setSubtasks([{ title: "" }]);
      closeTasksModal();

     
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6">
        <h2 className="pb-6 text-lg font-bold">Add New Task</h2>
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
            <div key={index} className="mb-3 flex justify-between">
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
                className="ml-4 text-red-500 hover:text-red-700"
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-6 w-full cursor-pointer appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-10"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">Doing</option>
            <option value="done">Done</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary mt-6 h-10 cursor-pointer rounded-3xl font-bold text-white disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
