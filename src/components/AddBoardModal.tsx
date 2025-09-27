"use client";

import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useState } from "react";
import Button from "./Button";

export default function AddBoardModal() {
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState([{ name: "Todo" }, { name: "Doing" }]);
  const [isLoading, setIsLoading] = useState(false);

  const { closeAddBoardModal } = useModal();
  const { createBoard } = useBoards();

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
    newColumns[index] = { name };
    setColumns(newColumns);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const boardData = {
        name: boardName.trim(),
        columns: columns
          .filter((column) => column.name.trim() !== "")
          .map((column) => ({ name: column.name.trim() })),
      };

      console.log("Creating board with:", boardData);

      // Use the BoardsContext to create the board
      await createBoard(boardData.name, boardData.columns);

      // Reset form and close modal
      setBoardName("");
      setColumns([{ name: "Todo" }, { name: "Doing" }]);
      closeAddBoardModal();
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-theme-surface relative mx-4 w-full max-w-[343px] rounded-lg p-6">
        <h2 className="text-theme-primary pb-6 text-lg font-bold">
          Add New Board
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-3 text-text-secondary pb-2 font-bold">
            Board Name
          </label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="placeholder:text-theme-secondary/50 border-theme text-theme-primary w-full rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
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
                className="placeholder:text-theme-secondary/50 border-theme text-theme-primary w-full rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium"
                placeholder="e.g. Todo"
                required
              />
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => removeColumn(index)}
                className="ml-4 !h-8 !w-8 !p-0"
                disabled={columns.length === 1}
              >
                <img
                  src="/icon-cross.svg"
                  alt="Remove column"
                  className="h-4 w-4"
                />
              </Button>
            </div>
          ))}

          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={addColumn}
            className="mb-6"
          >
            + Add New Column
          </Button>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isLoading}
            className="mt-6"
          >
            {isLoading ? "Creating..." : "Create New Board"}
          </Button>
        </form>
      </div>
    </div>
  );
}
