/**
 * Columns API Route Handler
 *
 * This file handles HTTP requests for column operations at the /api/columns endpoint.
 * It provides operations for creating new columns in existing boards.
 *
 * Supported Operations:
 * - POST: Create a new column in an existing board
 *
 * Database Operations:
 * - Inserts into 'board_columns' table
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

/**
 * POST /api/columns - Create a new column
 *
 * This endpoint creates a new column in an existing board.
 * It validates that both the column name and board ID are provided.
 *
 * Request Body:
 * - name: Column name (required)
 * - board_id: Board ID where the column belongs (required)
 *
 * @param request - The incoming HTTP request with column data
 * @returns JSON response with created column or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, board_id } = body;

    // Validate required fields
    if (!name || !board_id) {
      return NextResponse.json(
        { error: "Column name and board ID are required" },
        { status: 400 },
      );
    }

    // Create a new Supabase client instance
    const supabase = createClient();

    // Create the column in the database
    const { data: column, error: columnError } = await supabase
      .from("board_columns")
      .insert([
        {
          name: name.trim(), // Trim whitespace
          board_id: board_id, // Link to the parent board
          created_at: new Date().toISOString(), // Set creation timestamp
        },
      ])
      .select()
      .single();

    // Handle database errors
    if (columnError) {
      console.error("Error creating column:", columnError);
      return NextResponse.json(
        { error: "Failed to create column" },
        { status: 500 },
      );
    }

    // Return the created column
    return NextResponse.json(column, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/columns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
