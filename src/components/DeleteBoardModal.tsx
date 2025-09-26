"use client";

import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import Button from "./Button";

export default function DeleteBoardModal() {
  const { selectedBoard, closeDeleteBoardModal } = useModal();
  const { refreshBoards, setCurrentBoard, boards } = useBoards();

  if (!selectedBoard) return null;

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/boards/${selectedBoard.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete board");

      // If we're deleting the current board, switch to another board
      if (boards.length > 1) {
        const remainingBoards = boards.filter(
          (board) => board.id !== selectedBoard.id,
        );
        setCurrentBoard(remainingBoards[0] || null);
      } else {
        setCurrentBoard(null);
      }

      await refreshBoards();
      closeDeleteBoardModal();
    } catch (e) {
      console.error(e);
      alert("Failed to delete board. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6 md:max-w-[480px] md:p-8">
        <h2 className="heading-l pb-4 text-[#EA5555] md:pb-6">
          Delete this board?
        </h2>
        <p className="body-l text-secondary">
          Are you sure you want to delete the &apos;{selectedBoard.name}&apos;
          board? This action will remove all columns and tasks and cannot be
          reversed.
        </p>
        <div className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row md:gap-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full md:h-12"
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => closeDeleteBoardModal()}
            className="w-full md:h-12"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
