"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface BoardColumn {
  id: string;
  name: string;
  board_id: string;
  created_at: string;
}

interface Board {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  board_columns: BoardColumn[];
}

interface BoardsContextType {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  setCurrentBoard: (board: Board) => void;
  refreshBoards: () => Promise<void>;
  createBoard: (name: string, columns: { name: string }[]) => Promise<Board>;
  createColumn: (name: string, boardId: string) => Promise<BoardColumn>;
}

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export function BoardsProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = async () => {
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
  };

  const refreshBoards = async () => {
    await fetchBoards();
  };

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

  useEffect(() => {
    fetchBoards();
  }, []);

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
        createColumn,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardsContext);
  if (!context) throw new Error("useBoards must be used within BoardsProvider");
  return context;
}
