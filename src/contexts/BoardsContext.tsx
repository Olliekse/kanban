/**
 * Boards Context Provider
 *
 * This context manages all board-related state and operations in our kanban application.
 * It handles:
 * 1. Fetching boards from the API
 * 2. Managing the currently selected board
 * 3. Creating new boards and columns
 * 4. Board switching functionality
 *
 * Key Features:
 * - Board management (CRUD operations)
 * - Column management within boards
 * - Current board selection
 * - Error handling and loading states
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Board Column Interface
 *
 * Represents a column within a board (e.g., "To Do", "In Progress", "Done").
 * Each column can contain multiple tasks.
 */
interface BoardColumn {
  id: string; // Unique identifier
  name: string; // Column name (e.g., "To Do")
  board_id: string; // Parent board ID
  created_at: string; // Creation timestamp
}

/**
 * Board Interface
 *
 * Represents a complete kanban board with its columns.
 * Users can have multiple boards for different projects.
 */
interface Board {
  id: string; // Unique identifier
  name: string; // Board name
  created_at: string; // Creation timestamp
  updated_at: string; // Last update timestamp
  board_columns: BoardColumn[]; // Array of columns in this board
}

/**
 * Boards Context Type
 *
 * Defines the shape of the context value that will be provided
 * to all consuming components.
 */
interface BoardsContextType {
  boards: Board[]; // Array of all boards
  currentBoard: Board | null; // Currently selected board
  isLoading: boolean; // Loading state
  error: string | null; // Error message if any
  setCurrentBoard: (board: Board | null) => void; // Function to change current board
  refreshBoards: () => Promise<void>; // Function to refresh boards
  createBoard: (name: string, columns: { name: string }[]) => Promise<Board>; // Create new board
  updateBoard: (
    boardId: string,
    name: string,
    columns: { name: string }[],
  ) => Promise<Board>; // Update existing board
  createColumn: (name: string, boardId: string) => Promise<BoardColumn>; // Create new column
}

// Create the context with undefined as default value
const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

/**
 * Boards Provider Component
 *
 * This component provides board-related state and functions to all child components.
 * It manages board data, current board selection, and board/column creation.
 */
export function BoardsProvider({ children }: { children: ReactNode }) {
  // State management
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch boards from the API
   *
   * This function makes an HTTP request to get all boards.
   * It automatically sets the first board as current if none is selected.
   */
  const fetchBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/boards");

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      const fetchedBoards = await response.json();
      setBoards(fetchedBoards);

      // Set the first board as current if none is selected
      if (fetchedBoards.length > 0 && !currentBoard) {
        setCurrentBoard(fetchedBoards[0]);
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch boards");
    } finally {
      setIsLoading(false);
    }
  }, [currentBoard]);

  /**
   * Refresh boards
   *
   * Public function that components can call to refresh the board list.
   */
  const refreshBoards = async () => {
    await fetchBoards();
  };

  /**
   * Create a new board
   *
   * This function creates a new board with the specified name and columns.
   * It automatically sets the new board as the current board.
   *
   * @param name - The name of the new board
   * @param columns - Array of column names to create
   * @returns Promise that resolves to the created board
   */
  const createBoard = async (
    name: string,
    columns: { name: string }[],
  ): Promise<Board> => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, columns }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to create board");
      }

      const newBoard = await response.json();

      // Add the new board to the list
      setBoards((prev) => [newBoard, ...prev]);

      // Set the new board as current
      setCurrentBoard(newBoard);

      return newBoard;
    } catch (err) {
      console.error("Error creating board:", err);
      throw err;
    }
  };

  /**
   * Update an existing board
   *
   * This function updates a board's name and columns.
   * It updates both the current board state and the boards list.
   *
   * @param boardId - The ID of the board to update
   * @param name - The new name of the board
   * @param columns - Array of column names to update
   * @returns Promise that resolves to the updated board
   */
  const updateBoard = async (
    boardId: string,
    name: string,
    columns: { name: string }[],
  ): Promise<Board> => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, columns }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to update board");
      }

      const updatedBoard = await response.json();

      // Update the boards list
      setBoards((prev) =>
        prev.map((board) => (board.id === boardId ? updatedBoard : board)),
      );

      // Update current board if it's the one being edited
      if (currentBoard && currentBoard.id === boardId) {
        setCurrentBoard(updatedBoard);
      }

      return updatedBoard;
    } catch (err) {
      console.error("Error updating board:", err);
      throw err;
    }
  };

  /**
   * Create a new column in a board
   *
   * This function adds a new column to an existing board.
   * It updates both the current board state and the boards list.
   *
   * @param name - The name of the new column
   * @param boardId - The ID of the board to add the column to
   * @returns Promise that resolves to the created column
   */
  const createColumn = async (
    name: string,
    boardId: string,
  ): Promise<BoardColumn> => {
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, board_id: boardId }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to create column");
      }

      const newColumn = await response.json();

      // Update the current board with the new column
      if (currentBoard && currentBoard.id === boardId) {
        const updatedBoard = {
          ...currentBoard,
          board_columns: [...currentBoard.board_columns, newColumn],
        };
        setCurrentBoard(updatedBoard);

        // Update the boards list
        setBoards((prev) =>
          prev.map((board) => (board.id === boardId ? updatedBoard : board)),
        );
      }

      return newColumn;
    } catch (err) {
      console.error("Error creating column:", err);
      throw err;
    }
  };

  // Fetch boards when the component mounts
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Provide the context value to all child components
  return (
    <BoardsContext.Provider
      value={{
        boards,
        currentBoard,
        isLoading,
        error,
        setCurrentBoard,
        refreshBoards,
        createBoard,
        updateBoard,
        createColumn,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
}

/**
 * Custom hook to use the Boards context
 *
 * This hook provides easy access to the boards context. It includes
 * error handling to ensure the hook is only used within a BoardsProvider.
 *
 * @returns The boards context value
 * @throws Error if used outside of BoardsProvider
 */
export function useBoards() {
  const context = useContext(BoardsContext);
  if (!context) throw new Error("useBoards must be used within BoardsProvider");
  return context;
}
