/**
 * Individual Subtask API Route Handler
 *
 * This file handles HTTP requests for individual subtask operations at the /api/subtasks/[id] endpoint.
 * It provides operations for updating specific subtasks.
 *
 * Supported Operations:
 * - PUT: Update a subtask's completion status
 *
 * Database Operations:
 * - Updates the 'subtasks' table
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Request interface for updating a subtask
 *
 * This defines the expected structure of the request body
 * when updating an existing subtask via PUT request.
 */
interface UpdateSubtaskRequest {
  completed: boolean; // Whether the subtask is completed
}

/**
 * PUT /api/subtasks/[id] - Update a subtask
 *
 * This endpoint updates an existing subtask in the database.
 * Currently, it only allows updating the completion status.
 *
 * URL Parameters:
 * - id: The unique identifier of the subtask to update
 *
 * Request Body:
 * - completed: Boolean indicating if the subtask is completed
 *
 * @param request - The incoming HTTP request with update data
 * @param params - Route parameters containing the subtask ID
 * @returns JSON response with updated subtask or error message
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Extract subtask ID from URL parameters
    const params = await context.params;
    const { id } = params;

    // Parse the request body
    const body = (await request.json()) as UpdateSubtaskRequest;
    const { completed } = body;

    // Update the subtask in the database
    const { data: subtask, error } = await supabase
      .from("subtasks")
      .update({ completed }) // Update completion status
      .eq("id", id) // Match the specific subtask ID
      .select()
      .single();

    // Handle database errors
    if (error) {
      console.error("Error updating subtask:", error);
      return NextResponse.json(
        { error: "Failed to update subtask" },
        { status: 500 },
      );
    }

    // Check if subtask was found and updated
    if (!subtask) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }

    // Return the updated subtask
    return NextResponse.json(subtask);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
