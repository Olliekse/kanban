/**
 * Tasks Context Provider
 *
 * This context manages all task-related state and operations in our kanban application.
 * It handles:
 * 1. Fetching tasks from the API
 * 2. Managing task state (loading, error states)
 * 3. Drag and drop functionality for moving tasks between columns
 * 4. Optimistic updates for better user experience
 *
 * Key Features:
 * - Real-time task updates
 * - Drag and drop with optimistic UI updates
 * - Error handling and loading states
 * - Board-specific task filtering
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

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
 * Tasks Context Type
 *
 * Defines the shape of the context value that will be provided
 * to all consuming components.
 */
interface TasksContextType {
  tasks: Task[]; // Array of all tasks
  isLoading: boolean; // Loading state
  refreshTasks: (boardId?: string) => void; // Function to refresh tasks
  onDragEnd: (result: DropResult) => Promise<void>; // Drag and drop handler
}

// Create the context with undefined as default value
const TasksContext = createContext<TasksContextType | undefined>(undefined);

/**
 * Tasks Provider Component
 *
 * This component provides task-related state and functions to all child components.
 * It manages the task data, loading states, and drag-and-drop functionality.
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch tasks from the API
   *
   * This function makes an HTTP request to our API to get all tasks.
   * It can optionally filter by board ID.
   *
   * @param boardId - Optional board ID to filter tasks
   */
  const fetchTasks = async (boardId?: string) => {
    try {
      // Build the URL with optional board filter
      const url = boardId ? `/api/tasks?board_id=${boardId}` : "/api/tasks";
      const response = await fetch(url);

      if (response.ok) {
        const data = (await response.json()) as Task[];
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh tasks
   *
   * Public function that components can call to refresh the task list.
   *
   * @param boardId - Optional board ID to filter tasks
   */
  const refreshTasks = (boardId?: string) => {
    void fetchTasks(boardId);
  };

  /**
   * Handle drag and drop end event
   *
   * This function is called when a user finishes dragging a task.
   * It implements optimistic updates for better UX - the UI updates immediately,
   * then we sync with the server. If the server update fails, we revert the UI.
   *
   * @param result - The drag and drop result from @hello-pangea/dnd
   */
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination (dropped outside valid area), do nothing
    if (!destination) {
      return;
    }

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task being moved
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) {
      console.error("Task not found:", draggableId);
      return;
    }

    // OPTIMISTIC UPDATE: Update the UI immediately for better UX
    const newTasks = Array.from(tasks);
    const sourceIndex = newTasks.findIndex((t) => t.id === draggableId);

    // Check if the task was found
    if (sourceIndex === -1) {
      console.error("Task not found in tasks array:", draggableId);
      return;
    }

    // Remove the task from its current position
    const [movedTask] = newTasks.splice(sourceIndex, 1);

    // TypeScript safety check - this should never happen given our checks above
    if (!movedTask) {
      console.error("Failed to remove task from array");
      return;
    }

    // Update the column_id if moving to a different column
    if (destination.droppableId !== source.droppableId) {
      movedTask.column_id = destination.droppableId;
    }

    // Insert the task at the new position
    newTasks.splice(destination.index, 0, movedTask);

    // Update the state immediately
    setTasks(newTasks);

    // SERVER SYNC: Update the task in the database
    try {
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          column_id: destination.droppableId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update task position");
        // REVERT: If server update fails, revert the optimistic update
        setTasks(tasks);
      }
    } catch (error) {
      console.error("Error updating task position:", error);
      // REVERT: If server update fails, revert the optimistic update
      setTasks(tasks);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    void fetchTasks();
  }, []);

  // Provide the context value to all child components
  return (
    <TasksContext.Provider
      value={{ tasks, isLoading, refreshTasks, onDragEnd }}
    >
      {children}
    </TasksContext.Provider>
  );
}

/**
 * Custom hook to use the Tasks context
 *
 * This hook provides easy access to the tasks context. It includes
 * error handling to ensure the hook is only used within a TasksProvider.
 *
 * @returns The tasks context value
 * @throws Error if used outside of TasksProvider
 */
export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
