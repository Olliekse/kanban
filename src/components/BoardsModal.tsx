import Image from "next/image";
import Toggle from "./Toggle";
import AddBoardModal from "./AddBoardModal";
import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";

function BoardsModal() {
  const { openAddBoardModal, isAddBoardModalOpen } = useModal();
  const { boards, currentBoard, setCurrentBoard, isLoading } = useBoards();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-theme-surface absolute top-22 flex w-[264px] flex-col justify-center rounded-lg py-4">
        <h3 className="text-theme-secondary self-start pr-6 pb-[19px] pl-6 text-[12px] font-bold tracking-[2.4px] uppercase">
          All boards ({boards.length})
        </h3>
        <div>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p className="text-theme-secondary text-sm">Loading boards...</p>
            </div>
          ) : boards.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-theme-secondary text-center text-sm">
                No boards found. Create your first board to get started!
              </p>
              <button
                onClick={openAddBoardModal}
                className="bg-primary flex h-10 w-[180px] items-center justify-center rounded-3xl"
              >
                <span className="text-[14px] font-bold text-white">
                  + Create New Board
                </span>
              </button>
            </div>
          ) : (
            boards.map((board) => (
              <div
                key={board.id}
                className={`flex cursor-pointer gap-3 pt-[14px] pb-[15px] pl-6 hover:bg-gray-100 ${
                  currentBoard?.id === board.id
                    ? "bg-primary rounded-r-3xl"
                    : ""
                }`}
                onClick={() => setCurrentBoard(board)}
              >
                <Image
                  className="object-none"
                  src="/icon-board.svg"
                  height={16}
                  width={16}
                  alt="board icon"
                />
                <p
                  className={`text-[15px] font-bold ${
                    currentBoard?.id === board.id
                      ? "text-white"
                      : "text-theme-secondary"
                  }`}
                >
                  {board.name}
                </p>
              </div>
            ))
          )}
          {boards.length > 0 && (
            <div
              className="flex cursor-pointer gap-3 pt-[14px] pb-[15px] pl-6 hover:bg-gray-100"
              onClick={openAddBoardModal}
            >
              <Image
                className="object-none"
                src="/icon-board.svg"
                height={16}
                width={16}
                alt="board icon"
              />
              <p className="text-theme-secondary text-[15px] font-bold">
                + Create New Board
              </p>
            </div>
          )}
          <div className="bg-theme-surface-secondary mt-4 flex h-[48px] w-[235px] items-center justify-center justify-self-center rounded-lg">
            <div className="flex h-5 w-[121px] justify-between">
              <Image
                className="object-none"
                src="/icon-light-theme.svg"
                alt="light theme icon"
                height={18}
                width={18}
              />
              <Toggle />
              <Image
                className="object-none"
                src="/icon-dark-theme.svg"
                alt="dark theme icon"
                height={18}
                width={18}
              />
            </div>
          </div>
        </div>
      </div>
      {isAddBoardModalOpen && <AddBoardModal />}
    </div>
  );
}

export default BoardsModal;
