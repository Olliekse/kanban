"use client";

import TaskModal from "@/components/AddTaskModal";
import { useTasks } from "@/contexts/TasksContext";
import { useModal } from "@/contexts/ModalContext";
import BoardsModal from "@/components/BoardsModal";
import TaskDetailsModal from "@/components/TaskDetailsModal";

export default function Home() {
  const { tasks, isLoading } = useTasks();
  const {
    openTasksModal,
    isBoardsModalOpen,
    isTaskDetailsModalOpen,
    openTaskDetailsModal,
  } = useModal();

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
            onClick={() => openTasksModal}
            className="bg-primary flex h-12 w-[174px] items-center justify-center rounded-3xl"
          >
            <span className="text-[15px] font-bold text-white">
              + Add new task
            </span>
          </button>
        </div>

        <TaskModal />
      </div>
    );
  }

  return (
    <div className="bg-light-bg min-h-screen p-6">
      <div className="grid grid-cols-[280px_280px_280px] gap-6 overflow-x-auto">
        {/* Todo Column */}
        <div className="">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[15px] w-[15px] rounded-xl bg-[#49C4E5]"></div>
            <h2 className="text-light-text-secondary font-[Plus_Jakarta_Sans] text-[12px] font-bold tracking-[2.4px] uppercase">
              Todo ({getTasksByStatus("todo").length})
            </h2>
          </div>
          <div className="space-y-3">
            {getTasksByStatus("todo").map((task) => (
              <div
                key={task.id}
                onClick={() => openTaskDetailsModal()}
                className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800">{task.title}</h3>

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

        {/* Doing Column */}
        <div className="rounded-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[15px] w-[15px] rounded-xl bg-[#8471F2]"></div>
            <h2 className="text-light-text-secondary font-[Plus_Jakarta_Sans] text-[12px] font-bold tracking-[2.4px] uppercase">
              Doing ({getTasksByStatus("doing").length})
            </h2>
          </div>
          <div className="space-y-3">
            {getTasksByStatus("doing").map((task) => (
              <div
                onClick={() => openTaskDetailsModal()}
                key={task.id}
                className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
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
        <div className="rounded-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[15px] w-[15px] rounded-xl bg-[#67E2AE]"></div>
            <h2 className="text-light-text-secondary font-[Plus_Jakarta_Sans] text-[12px] font-bold tracking-[2.4px] uppercase">
              Done ({getTasksByStatus("done").length})
            </h2>
          </div>
          <div className="space-y-3">
            {getTasksByStatus("done").map((task) => (
              <div
                key={task.id}
                onClick={() => openTaskDetailsModal()}
                className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
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
          {isBoardsModalOpen && <BoardsModal />}

          {isTaskDetailsModalOpen && <TaskDetailsModal />}
        </div>
      </div>
    </div>
  );
}
