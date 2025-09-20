/**
 * Boards API Route Handler
 *
 * This file handles HTTP requests for board operations at the /api/boards endpoint.
 * It provides CRUD operations for boards in our kanban application.
 *
 * Supported Operations:
 * - GET: Retrieve all boards with their columns
 * - POST: Create a new board with initial columns
 *
 * Database Operations:
 * - Queries the 'boards' table with related 'board_columns'
 * - Creates boards and their initial columns in a transaction-like manner
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

/**
 * POST /api/boards - Create a new board
 *
 * This endpoint creates a new board in the database along with its initial columns.
 * It performs the operation in two steps: create the board, then create the columns.
 * If column creation fails, it cleans up the board to maintain data consistency.
 *
 * Request Body:
 * - name: Board name (required)
 * - columns: Array of column objects with name property (required, at least one)
 *
 * @param request - The incoming HTTP request with board data
 * @returns JSON response with created board or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, columns } = body;

    // Validate required fields
    if (!name || !columns || columns.length === 0) {
      return NextResponse.json(
        { error: "Board name and at least one column are required" },
        { status: 400 },
      );
    }

    // Create a new Supabase client instance
    const supabase = createClient();

    // STEP 1: Create the board in the database
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert([
        {
          name: name.trim(), // Trim whitespace
          created_at: new Date().toISOString(), // Set creation timestamp
        },
      ])
      .select()
      .single();

    // Handle board creation errors
    if (boardError) {
      console.error("Error creating board:", boardError);
      return NextResponse.json(
        { error: "Failed to create board" },
        { status: 500 },
      );
    }

    // STEP 2: Create the initial columns for the board
    const columnsData = columns.map((column: { name: string }) => ({
      name: column.name.trim(), // Trim whitespace
      board_id: board.id, // Link to the created board
      created_at: new Date().toISOString(), // Set creation timestamp
    }));

    const { error: columnsError } = await supabase
      .from("board_columns")
      .insert(columnsData);

    // Handle column creation errors
    if (columnsError) {
      console.error("Error creating columns:", columnsError);

      // CLEANUP: If column creation fails, delete the board to maintain consistency
      await supabase.from("boards").delete().eq("id", board.id);

      return NextResponse.json(
        { error: "Failed to create board columns" },
        { status: 500 },
      );
    }

    // Return the created board (columns will be fetched separately by the frontend)
    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/boards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/boards - Retrieve all boards
 *
 * This endpoint fetches all boards from the database along with their columns.
 * Boards are ordered by creation date (most recent first).
 *
 * @returns JSON response with boards array (including columns) or error message
 */
export async function GET() {
  try {
    // Create a new Supabase client instance
    const supabase = createClient();

    // Fetch all boards with their associated columns
    const { data: boards, error } = await supabase
      .from("boards")
      .select(
        `
        *,
        board_columns (*)
      `,
      )
      .order("created_at", { ascending: false }); // Most recent boards first

    // Handle database errors
    if (error) {
      console.error("Error fetching boards:", error);
      return NextResponse.json(
        { error: "Failed to fetch boards" },
        { status: 500 },
      );
    }

    // Return the boards data with their columns
    return NextResponse.json(boards);
  } catch (error) {
    console.error("Error in GET /api/boards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
