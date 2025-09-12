"use client";

import { useState, useEffect } from "react";
import TaskModal from "@/components/TaskModal";

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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listen for the header button click
  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
    
    window.addEventListener('openTaskModal', handleOpenModal);
    return () => window.removeEventListener('openTaskModal', handleOpenModal);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
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

  useEffect(() => {
    void fetchTasks();
  }, []);

  const handleTaskCreated = () => {
    void fetchTasks();
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="bg-light-bg text-light-text-secondary flex h-[100vh] flex-col items-center justify-center px-4 text-center text-[18px] font-bold">
        <div className="flex flex-col items-center gap-[25px]">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-light-bg text-light-text-secondary flex h-[100vh] flex-col items-center justify-center px-4 text-center text-[18px] font-bold">
        <div className="flex flex-col items-center gap-[25px]">
          <p>This board is empty. Create a new task to get started.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary flex h-12 w-[174px] items-center justify-center rounded-3xl"
          >
            <span className="text-[15px] font-bold text-white">
              + Add new task
            </span>
          </button>
        </div>
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      </div>
    );
  }

  return (
    <div className="bg-light-bg min-h-screen p-6">
      {/* Remove the duplicate header section */}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Todo Column */}
        <div className="rounded-lg bg-gray-100 p-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-600">
            Todo ({getTasksByStatus("todo").length})
          </h2>
          <div className="space-y-3">
            {getTasksByStatus("todo").map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {task.description}
                  </p>
                )}
                {task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-gray-500">Subtasks:</p>
                    <ul className="space-y-1">
                      {task.subtasks.map((subtask) => (
                        <li key={subtask.id} className="text-sm text-gray-600">
                          • {subtask.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="rounded-lg bg-gray-100 p-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-600">
            In Progress ({getTasksByStatus("in-progress").length})
          </h2>
          <div className="space-y-3">
            {getTasksByStatus("in-progress").map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {task.description}
                  </p>
                )}
                {task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-gray-500">Subtasks:</p>
                    <ul className="space-y-1">
                      {task.subtasks.map((subtask) => (
                        <li key={subtask.id} className="text-sm text-gray-600">
                          • {subtask.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="rounded-lg bg-gray-100 p-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-600">
            Done ({getTasksByStatus("done").length})
          </h2>
          <div className="space-y-3">
            {getTasksByStatus("done").map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {task.description}
                  </p>
                )}
                {task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-gray-500">Subtasks:</p>
                    <ul className="space-y-1">
                      {task.subtasks.map((subtask) => (
                        <li key={subtask.id} className="text-sm text-gray-600">
                          • {subtask.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
