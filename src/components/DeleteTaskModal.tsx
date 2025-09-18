"use client";

import { useModal } from "@/contexts/ModalContext";
import { useTasks } from "@/contexts/TasksContext";

export default function DeleteTaskModal() {
  const { selectedTask, closeDeleteTaskModal, closeTaskDetailsModal } =
    useModal();
  const { refreshTasks } = useTasks();

  if (!selectedTask) return null;

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await refreshTasks();
      closeDeleteTaskModal();
      closeTaskDetailsModal();
    } catch (e) {
      console.error(e);
      alert("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6">
        <h2 className="pb-6 text-[18px] font-bold text-[#EA5555]">
          Delete this task?
        </h2>
        <p className="text-light-text-secondary text-[13px] leading-[23px] font-medium">
          Are you sure you want to delete the ‘{selectedTask.title}’ task and
          its subtasks? This action cannot be reversed.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleDelete}
            className="h-10 w-full cursor-pointer rounded-3xl bg-[#EA5555] font-bold text-white"
          >
            Delete
          </button>
          <button
            onClick={() => closeDeleteTaskModal()}
            className="bg-primary/10 text-primary h-10 w-full cursor-pointer rounded-3xl font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


