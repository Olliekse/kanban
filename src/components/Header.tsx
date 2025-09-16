import Image from "next/image";
import "@/styles/globals.css";
import { useTasks } from "@/contexts/TasksContext";
import { useModal } from "@/contexts/ModalContext";

function Header() {
  const { openTasksModal, isBoardsModalOpen, toggleBoardsModal } = useModal();
  const { tasks } = useTasks();

  return (
    <div className="relative z-60 flex w-full items-center justify-between bg-white px-4 py-5">
      <Image src="/logo-mobile.svg" alt="header logo" width={24} height={25} />
      <div className="flex cursor-pointer gap-2 pl-4">
        <button
          onClick={() => toggleBoardsModal()}
          className="not-last: cursor-pointer text-[18px] font-bold text-[#000112]"
        >
          Platform Launch
        </button>
        {!isBoardsModalOpen ? (
          <Image
            className="cursor-pointer object-none"
            src="/icon-chevron-down.svg"
            width={8}
            height={4}
            alt="chevron arrow expand"
          />
        ) : (
          <Image
            className="cursor-pointer object-none"
            src="/icon-chevron-up.svg"
            width={8}
            height={4}
            alt="chevron arrow collapse"
          />
        )}
      </div>
      <div className="flex gap-4 pl-19">
        <button
          onClick={() => openTasksModal()}
          className={`${tasks.length !== 0 ? "bg-primary" : "bg-primary/20"} flex h-8 w-12 cursor-pointer items-center justify-center rounded-3xl`}
        >
          <Image
            alt="add task button"
            src="/icon-add-task-mobile.svg"
            width={12}
            height={12}
          />
        </button>
        <Image
          className="object-none"
          src="/icon-vertical-ellipsis.svg"
          alt="3-dot menu icon"
          width={4}
          height={16}
        />
      </div>
    </div>
  );
}

export default Header;
