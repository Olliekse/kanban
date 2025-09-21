/**
 * Individual Board API Route Handler
 *
 * This file handles HTTP requests for individual board operations at the /api/boards/[id] endpoint.
 * It provides operations for updating and deleting specific boards.
 *
 * Supported Operations:
 * - PUT: Update board details and columns
 * - DELETE: Remove a board and all its associated data
 *
 * Database Operations:
 * - Updates/Deletes from 'boards' table
 * - Manages columns in 'board_columns' table
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

/**
 * PUT /api/boards/[id] - Update a board
 *
 * Updates a board's name and columns. This operation:
 * 1. Updates the board name
 * 2. Updates existing columns
 * 3. Creates new columns
 * 4. Removes deleted columns
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the board ID
 * @returns JSON response with the updated board or error message
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const boardId = params.id;

    // Validate board ID
    if (!boardId) {
      return NextResponse.json(
        { error: "Board ID is required" },
        { status: 400 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, columns } = body;

    // Validate required fields
    if (!name || !columns) {
      return NextResponse.json(
        { error: "Name and columns are required" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = createClient();

    // Update board name
    const { data: updatedBoard, error: boardError } = await supabase
      .from("boards")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", boardId)
      .select()
      .single();

    if (boardError) {
      console.error("Error updating board:", boardError);
      return NextResponse.json(
        { error: "Failed to update board" },
        { status: 500 },
      );
    }

    // Delete existing columns for the board
    const { error: deleteError } = await supabase
      .from("board_columns")
      .delete()
      .eq("board_id", boardId);

    if (deleteError) {
      console.error("Error deleting existing columns:", deleteError);
      return NextResponse.json(
        { error: "Failed to update columns" },
        { status: 500 },
      );
    }

    // Insert new columns
    const columnsToInsert = columns.map((column: { name: string }) => ({
      name: column.name,
      board_id: boardId,
    }));

    const { data: newColumns, error: insertError } = await supabase
      .from("board_columns")
      .insert(columnsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting new columns:", insertError);
      return NextResponse.json(
        { error: "Failed to create new columns" },
        { status: 500 },
      );
    }

    // Return updated board with new columns
    return NextResponse.json({
      ...updatedBoard,
      board_columns: newColumns,
    });
  } catch (error) {
    console.error("Error in PUT /api/boards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
