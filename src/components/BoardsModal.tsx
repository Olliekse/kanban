import Image from "next/image";
import Toggle from "./Toggle";

function BoardsModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="absolute top-20 flex w-[264px] flex-col justify-center rounded-lg bg-white py-4">
        <h3 className="text-light-text-secondary self-start pr-6 pb-[19px] pl-6 text-[12px] font-bold tracking-[2.4px] uppercase">
          All boards (X)
        </h3>
        <div>
          <div className="bg-primary flex w-[240px] gap-3 rounded-r-3xl pt-[14px] pb-[15px] pl-6">
            <Image
              className="object-none"
              src="/icon-board.svg"
              height={16}
              width={16}
              alt="board icon"
            />
            <p className="text-[15px] font-bold text-white">Platform Launch</p>
          </div>
          <div className="flex gap-3 pt-[14px] pb-[15px] pl-6 text-white">
            <Image
              className="object-none"
              src="/icon-board.svg"
              height={16}
              width={16}
              alt="board icon"
            />
            <p className="text-light-text-secondary text-[15px] font-bold">
              Marketing Plan
            </p>
          </div>
          <div className="flex gap-3 pt-[14px] pb-[15px] pl-6">
            <Image
              className="object-none"
              src="/icon-board.svg"
              height={16}
              width={16}
              alt="board icon"
            />
            <p className="text-light-text-secondary text-[15px] font-bold">
              Roadmap
            </p>
          </div>
          <div className="flex gap-3 pt-[14px] pb-[15px] pl-6">
            <Image
              className="object-none"
              src="/icon-board.svg"
              height={16}
              width={16}
              alt="board icon"
            />
            <p className="text-light-text-secondary text-[15px] font-bold">
              + Create New Board
            </p>
          </div>
          <div className="mt-4 flex h-[48px] w-[235px] items-center justify-center justify-self-center rounded-lg bg-[#f4f7fd]">
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
    </div>
  );
}

export default BoardsModal;
