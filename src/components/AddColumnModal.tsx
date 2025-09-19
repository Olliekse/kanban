"use client";

import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useState } from "react";

export default function AddColumnModal() {
  const [columnName, setColumnName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { closeAddColumnModal } = useModal();
  const { createColumn, currentBoard } = useBoards();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentBoard) {
      alert("No board selected");
      return;
    }

    setIsLoading(true);

    try {
      await createColumn(columnName.trim(), currentBoard.id);

      // Reset form and close modal
      setColumnName("");
      closeAddColumnModal();
    } catch (error) {
      console.error("Error creating column:", error);
      alert("Failed to create column. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6">
        <h2 className="pb-6 text-lg font-bold text-[#000112]">
          Add New Column
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-3 text-text-secondary pb-2 font-bold">
            Column Name
          </label>
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="placeholder:text-dark-bg/25 w-full rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
            placeholder="e.g. In Progress"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary mt-6 h-10 cursor-pointer rounded-3xl font-bold text-white disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create New Column"}
          </button>
        </form>
      </div>
    </div>
  );
}
