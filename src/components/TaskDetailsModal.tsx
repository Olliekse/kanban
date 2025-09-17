import Image from "next/image";

function TaskDetailsModal() {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-[343px] rounded-lg bg-white p-6">
        <div className="flex flex-col gap-6">
          <div className="flex">
            <h3 className="text-[18px] font-bold text-[#000112]">
              Research pricing points of various competitors and trial different
              business models
            </h3>
            <Image
              className="object-none"
              src="/icon-vertical-ellipsis.svg"
              alt="3-dot menu icon"
              width={4}
              height={16}
            />
          </div>
          <p className="text-light-text-secondary text-[13px] leading-[23px] font-medium">
            We know what we're planning to build for version one. Now we need to
            finalise the first pricing model we'll use. Keep iterating the
            subtasks until we have a coherent proposition.
          </p>
          <span className="text-light-text-secondary text-[12px] font-bold">
            Subtasks (2 of 3)
          </span>
        </div>
        <div className="mt-4 mb-6 flex flex-col gap-2">
          <div className="flex gap-4 bg-[#f4f7fd] p-3">
            <input type="checkbox" />
            <p className="strikethrough text-[12px] font-bold text-[#000112] opacity-50">
              Research competitor pricing and business models
            </p>
          </div>
          <div className="flex gap-4 bg-[#f4f7fd] p-3">
            <input type="checkbox" />
            <p className="strikethrough text-[12px] font-bold text-[#000112] opacity-50">
              Outline a business model that works for our solution
            </p>
          </div>
          <div className="flex gap-4 bg-[#f4f7fd] p-3">
            <input type="checkbox" />
            <p className="strikethrough text-[12px] font-bold text-[#000112] opacity-50">
              Surveying and testing
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-light-text-secondary text-[12px] font-bold">
            Current status
          </span>
          <div className="relative mb-6">
            <select
              // value={status}
              // onChange={(e) => setStatus(e.target.value)}
              className="border-light-text-secondary/25 w-full cursor-pointer appearance-none rounded border px-4 py-2 pr-10"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">Doing</option>
              <option value="done">Done</option>
            </select>
            <Image
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
              src="/icon-chevron-down.svg"
              width={9}
              height={5}
              alt="dropdown arrow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
