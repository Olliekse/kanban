"use client";

import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useState, useEffect } from "react";

export default function EditBoardModal() {
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState<{ name: string; id?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { closeEditBoardModal, selectedBoardForEdit } = useModal();
  const { updateBoard } = useBoards();

  // Initialize form with current board data
  useEffect(() => {
    if (selectedBoardForEdit) {
      setBoardName(selectedBoardForEdit.name);
      setColumns(
        selectedBoardForEdit.board_columns.map((col) => ({
          name: col.name,
          id: col.id,
        })),
      );
    }
  }, [selectedBoardForEdit]);

  const addColumn = () => {
    setColumns([...columns, { name: "" }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const updateColumn = (index: number, name: string) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], name };
    setColumns(newColumns);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoardForEdit) return;

    setIsLoading(true);

    try {
      const boardData = {
        name: boardName.trim(),
        columns: columns
          .filter((column) => column.name.trim() !== "")
          .map((column) => ({ name: column.name.trim() })),
      };

      console.log("Updating board with:", boardData);

      // Use the BoardsContext to update the board
      await updateBoard(
        selectedBoardForEdit.id,
        boardData.name,
        boardData.columns,
      );

      // Close modal
      closeEditBoardModal();
    } catch (error) {
      console.error("Error updating board:", error);
      alert("Failed to update board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedBoardForEdit) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[480px] rounded-lg bg-white p-6">
        <h2 className="pb-6 text-lg font-bold text-[#000112]">Edit Board</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-3 text-text-secondary pb-2 font-bold">
            Board Name
          </label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="placeholder:text-dark-bg/25 w-full rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
            placeholder="e.g. Web Design"
            required
          />

          <label className="text-3 text-text-secondary pt-6 pb-2 font-bold">
            Board Columns
          </label>
          {columns.map((column, index) => (
            <div key={index} className="mb-3 flex justify-between">
              <input
                type="text"
                value={column.name}
                onChange={(e) => updateColumn(index, e.target.value)}
                className="placeholder:text-dark-bg/25 w-full rounded border border-gray-300 px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
                placeholder="e.g. Todo"
                required
              />
              <button
                type="button"
                onClick={() => removeColumn(index)}
                className="ml-4 text-[#979797] hover:text-red-700"
                disabled={columns.length === 1}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addColumn}
            className="bg-primary/10 text-primary mb-6 h-10 cursor-pointer rounded-3xl font-bold"
          >
            + Add New Column
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary h-10 cursor-pointer rounded-3xl font-bold text-white disabled:opacity-50"
          >
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
