"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  task_id: string;
}

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  refreshTasks: (boardId?: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async (boardId?: string) => {
    try {
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

  const refreshTasks = (boardId?: string) => {
    void fetchTasks(boardId);
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, isLoading, refreshTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
