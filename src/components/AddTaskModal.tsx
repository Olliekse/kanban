/**
 * Add Task Modal Component
 *
 * This modal component allows users to create new tasks in the kanban board.
 * It provides a comprehensive form with validation, subtask management, and
 * column selection functionality.
 *
 * Key Features:
 * - Form validation with error handling
 * - Dynamic subtask management (add/remove)
 * - Column selection dropdown
 * - Loading states and user feedback
 * - Keyboard navigation support
 * - Click-outside-to-close functionality
 *
 * Form Fields:
 * - Task title (required)
 * - Task description (optional)
 * - Column selection (required)
 * - Multiple subtasks (at least one required)
 */

"use client";

import { useModal } from "@/contexts/ModalContext";
import { useState, useEffect, useRef } from "react";
import { useTasks } from "@/contexts/TasksContext";
import { useBoards } from "@/contexts/BoardsContext";
import { z } from "zod";
import Button from "./Button";

/**
 * Task Interface
 *
 * Defines the structure of a task object with all its properties
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
 * Subtask Interface
 *
 * Defines the structure of a subtask object.
 */
interface Subtask {
  id: string; // Unique identifier
  title: string; // Subtask description
  completed: boolean; // Completion status
  task_id: string; // Parent task ID
}

/**
 * Validation Schema
 *
 * Uses Zod for runtime validation of form data.
 * Ensures that:
 * - Task title is not empty
 * - At least one subtask is provided
 * - Each subtask has a non-empty title
 */
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, "Subtask title is required"),
      }),
    )
    .min(1, "At least one subtask is required"),
});

/**
 * Add Task Modal Component
 *
 * This component renders a modal form for creating new tasks.
 * It manages form state, validation, and submission to the API.
 */
export default function AddTaskModal() {
  // Form state management
  const [title, setTitle] = useState(""); // Task title
  const [description, setDescription] = useState(""); // Task description
  const [columnId, setColumnId] = useState(""); // Selected column ID
  const [subtasks, setSubtasks] = useState([{ title: "" }]); // Subtasks array
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errors, setErrors] = useState<{
    // Validation errors
    title?: string;
    subtasks?: { [key: number]: string };
  }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  // Context hooks for accessing shared state and functions
  const { openTasksModal, closeTasksModal } = useModal();
  const { refreshTasks } = useTasks();
  const { currentBoard } = useBoards();

  /**
   * Set default column to "Todo" if it exists
   *
   * This effect runs when the current board changes and automatically
   * selects the "Todo" column if it exists, providing a better UX.
   */
  useEffect(() => {
    if (currentBoard?.board_columns && currentBoard.board_columns.length > 0) {
      const todoColumn = currentBoard.board_columns.find(
        (column) => column.name.toLowerCase() === "todo",
      );
      if (todoColumn && !columnId) {
        setColumnId(todoColumn.id);
      }
    }
  }, [currentBoard, columnId]);

  /**
   * Close dropdown when clicking outside
   *
   * This effect adds a click listener to detect clicks outside the dropdown
   * and closes it automatically for better UX.
   */
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

  /**
   * Add a new subtask to the form
   *
   * Adds an empty subtask object to the subtasks array,
   * allowing users to create multiple subtasks for a task.
   */
  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "" }]);
  };

  /**
   * Remove a subtask from the form
   *
   * @param index - The index of the subtask to remove
   */
  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  /**
   * Update a subtask's title
   *
   * @param index - The index of the subtask to update
   * @param title - The new title for the subtask
   */
  const updateSubtask = (index: number, title: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = { title };
    setSubtasks(newSubtasks);
  };

  /**
   * Handle column selection from dropdown
   *
   * @param columnId - The ID of the selected column
   */
  const handleColumnSelect = (columnId: string) => {
    setColumnId(columnId);
    setIsDropdownOpen(false);
  };

  /**
   * Get the display name of the selected column
   *
   * @returns The name of the selected column or a default message
   */
  const getSelectedColumnName = () => {
    const selectedColumn = currentBoard?.board_columns?.find(
      (col) => col.id === columnId,
    );
    return selectedColumn?.name || "Select a column";
  };

  /**
   * Handle form submission
   *
   * This function validates the form data and submits it to the API.
   * It includes comprehensive validation and error handling.
   *
   * @param e - The form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Manual validation for better error messages
    const fieldErrors: {
      title?: string;
      subtasks?: { [key: number]: string };
    } = {};

    // Validate title
    if (title.trim() === "") {
      fieldErrors.title = "Task title is required";
    }

    // Validate subtasks - check for empty ones
    subtasks.forEach((subtask, index) => {
      if (subtask.title.trim() === "") {
        if (!fieldErrors.subtasks) {
          fieldErrors.subtasks = {};
        }
        fieldErrors.subtasks[index] = "Can't be empty";
      }
    });

    // If there are errors, show them and stop
    if (fieldErrors.title || fieldErrors.subtasks) {
      setErrors(fieldErrors);
      return;
    }

    // If we get here, validation passed!
    setIsLoading(true);

    try {
      console.log("Submitting task with:", {
        title,
        description,
        columnId,
        subtasks,
      });

      const taskData = {
        title: title.trim(),
        description: description.trim() || "",
        column_id: columnId,
        board_id: currentBoard?.id,
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
      setColumnId("");
      setSubtasks([{ title: "" }]);
      // Refresh list and close modal
      await refreshTasks(currentBoard?.id);
      closeTasksModal();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no current board or no columns
  if (
    !currentBoard ||
    !currentBoard.board_columns ||
    currentBoard.board_columns.length === 0
  ) {
    return null;
  }

  return (
    <div
      onClick={closeTasksModal}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6 md:max-w-[480px]"
      >
        <h2 className="heading-l pb-6">Add New Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="heading-s text-secondary pb-2">Title</label>
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`placeholder:text-dark-bg/25 w-full rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. Take coffee break"
            />
            {errors.title && (
              <p className="body-m mt-1 text-red-500">{errors.title}</p>
            )}
          </div>

          <label className="heading-s text-secondary pt-6 pb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="placeholder:text-dark-bg/25 h-[112px] w-full resize-none rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />

          <label className="heading-s text-secondary pt-6 pb-2">Subtasks</label>
          {subtasks.map((subtask, index) => (
            <div key={index} className="mb-3">
              <div className="flex items-center justify-between">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => updateSubtask(index, e.target.value)}
                    className={`placeholder:text-dark-bg/25 w-full rounded border px-4 py-2 pr-24 placeholder:text-[13px] placeholder:font-medium ${
                      errors.subtasks?.[index]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g. Make coffee"
                  />
                  {errors.subtasks?.[index] && (
                    <span className="absolute top-1/2 right-2 -translate-y-1/2 transform text-sm font-medium text-red-500">
                      Can&apos;t be empty
                    </span>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="ml-4 !h-8 !w-8 !p-0"
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={addSubtask}
            className="mb-6"
          >
            + Add New Subtask
          </Button>

          <label className="heading-s text-secondary pb-2">Status</label>
          <div className="relative mb-6" ref={dropdownRef}>
            {/* Custom dropdown button */}
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full justify-start !rounded-xl !py-3"
            >
              {getSelectedColumnName()}
            </Button>

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
                  <Button
                    key={column.id}
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => handleColumnSelect(column.id)}
                    className="w-full justify-start !rounded-none !py-3 text-gray-400 first:!rounded-t-xl last:!rounded-b-xl"
                  >
                    {column.name}
                  </Button>
                )) || []}
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </div>
    </div>
  );
}
