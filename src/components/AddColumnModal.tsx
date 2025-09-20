import { useModal } from "@/contexts/ModalContext";
import { useBoards } from "@/contexts/BoardsContext";
import { useState } from "react";
import { z } from "zod";

// Validation schema
const columnSchema = z.object({
  columnName: z.string().min(1, "Can't be empty"),
});

export default function AddColumnModal() {
  const [columnName, setColumnName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ columnName?: string }>({});

  const { closeAddColumnModal } = useModal();
  const { createColumn, currentBoard } = useBoards();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with columnName:", columnName);

    // Clear previous errors
    setErrors({});

    // Validate the form data using Zod
    const validationResult = columnSchema.safeParse({
      columnName: columnName.trim(),
    });

    console.log("Validation result:", validationResult);

    // If validation fails, show errors and stop
    if (!validationResult.success) {
      console.log("Validation failed, errors:", validationResult.error);

      const fieldErrors: { columnName?: string } = {};

      // Try a different approach - access the issues directly
      console.log("Error issues:", validationResult.error.issues);

      if (validationResult.error.issues) {
        validationResult.error.issues.forEach((issue) => {
          console.log("Processing issue:", issue);
          console.log("Issue path:", issue.path);
          console.log("Issue message:", issue.message);

          if (issue.path.length > 0 && issue.path[0] === "columnName") {
            fieldErrors.columnName = issue.message;
            console.log("Setting columnName error:", issue.message);
          }
        });
      }

      console.log("Setting field errors:", fieldErrors);
      setErrors(fieldErrors);
      return;
    }

    console.log("Validation passed, proceeding with API call");

    // If we get here, validation passed!
    if (!currentBoard) {
      alert("No board selected");
      return;
    }

    setIsLoading(true);

    try {
      await createColumn(columnName.trim(), currentBoard.id);
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
          <div className="relative">
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className={`placeholder:text-dark-bg/25 w-full rounded border px-4 py-2 placeholder:text-[13px] placeholder:font-medium ${
                errors.columnName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. In Progress"
            />
            {errors.columnName && (
              <div className="absolute top-3 right-4 text-xs text-red-500">
                {errors.columnName}
              </div>
            )}
          </div>

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
