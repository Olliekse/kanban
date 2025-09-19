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
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6 md:max-w-[480px] md:p-8">
        <h2 className="pb-4 text-[18px] font-bold text-[#EA5555] md:pb-6 md:text-[20px]">
          Delete this task?
        </h2>
        <p className="text-[13px] leading-[23px] font-medium text-[#828FA3] md:text-[14px] md:leading-[24px]">
          Are you sure you want to delete the '{selectedTask.title}' task and
          its subtasks? This action cannot be reversed.
        </p>
        <div className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:gap-4">
          <button
            onClick={handleDelete}
            className="h-10 w-full cursor-pointer rounded-3xl bg-[#EA5555] font-bold text-white transition-colors hover:bg-[#FF9898] md:h-12"
          >
            Delete
          </button>
          <button
            onClick={() => closeDeleteTaskModal()}
            className="h-10 w-full cursor-pointer rounded-3xl bg-[#E4EBFA] font-bold text-[#635FC7] transition-colors hover:bg-[#C8D0E8] md:h-12"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
