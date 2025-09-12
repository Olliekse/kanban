import Image from "next/image";
import "@/styles/globals.css";

interface HeaderProps {
  onAddTask: () => void;

}

function Header({ onAddTask }: HeaderProps) {
  return (
    <div className="flex w-full items-center justify-between px-4 py-5">
      <Image src="/logo-mobile.svg" alt="header logo" width={24} height={25} />
      <div className="flex gap-2 pl-4">
        <h1 className="text-[18px] font-bold text-[#000112]">
          Platform Launch
        </h1>
        <Image
          className="object-none"
          src="/icon-chevron-down.svg"
          width={8}
          height={4}
          alt="chevron arrow"
        />
      </div>
      <div className="flex gap-4 pl-19">
        <button
          onClick={onAddTask}
          className="bg-primary/25 flex h-8 w-12 cursor-pointer items-center justify-center rounded-3xl"
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
