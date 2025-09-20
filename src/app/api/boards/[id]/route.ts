/**
 * Individual Board API Route Handler
 *
 * This file handles HTTP requests for individual board operations at the /api/boards/[id] endpoint.
 * It provides operations for deleting specific boards.
 *
 * Supported Operations:
 * - DELETE: Remove a board and all its associated data
 *
 * Database Operations:
 * - Deletes from 'boards' table (cascades to columns and tasks)
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

/**
 * DELETE /api/boards/[id] - Delete a board
 *
 * This endpoint permanently removes a board from the database.
 * Due to foreign key constraints, this will also delete:
 * - All columns belonging to the board
 * - All tasks belonging to those columns
 * - All subtasks belonging to those tasks
 *
 * URL Parameters:
 * - id: The unique identifier of the board to delete
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the board ID
 * @returns JSON response with success confirmation or error message
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Extract board ID from URL parameters
    const params = await context.params;
    const boardId = params.id;

    // Validate board ID
    if (!boardId) {
      return NextResponse.json(
        { error: "Board ID is required" },
        { status: 400 },
      );
    }

    // Create a new Supabase client instance
    const supabase = createClient();

    // Delete the board from the database
    // Note: This will cascade delete columns and tasks due to foreign key constraints
    const { error } = await supabase.from("boards").delete().eq("id", boardId);

    // Handle database errors
    if (error) {
      console.error("Error deleting board:", error);
      return NextResponse.json(
        { error: "Failed to delete board" },
        { status: 500 },
      );
    }

    // Return success confirmation
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/boards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
