/**
 * Individual Task API Route Handler
 *
 * This file handles HTTP requests for individual task operations at the /api/tasks/[id] endpoint.
 * It provides operations for updating and deleting specific tasks.
 *
 * Supported Operations:
 * - PUT: Update an existing task (title, description, column)
 * - DELETE: Remove a task from the database
 *
 * Database Operations:
 * - Updates the 'tasks' table for PUT operations
 * - Deletes from 'tasks' table for DELETE operations
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Request interface for updating a task
 *
 * This defines the expected structure of the request body
 * when updating an existing task via PUT request.
 */
interface UpdateTaskRequest {
  title: string; // Task title (required)
  description?: string; // Optional task description
  column_id: string; // Which column the task belongs to (required)
}

/**
 * PUT /api/tasks/[id] - Update an existing task
 *
 * This endpoint updates an existing task in the database.
 * It allows changing the task's title, description, and column position.
 *
 * URL Parameters:
 * - id: The unique identifier of the task to update
 *
 * Request Body:
 * - title: New task title (required)
 * - description: New task description (optional)
 * - column_id: New column ID where task belongs (required)
 *
 * @param request - The incoming HTTP request with update data
 * @param params - Route parameters containing the task ID
 * @returns JSON response with updated task or error message
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Extract task ID from URL parameters
    const params = await context.params;
    const { id } = params;

    // Parse the request body
    const body = (await request.json()) as UpdateTaskRequest;
    const { title, description, column_id } = body;

    // Validate required fields
    if (!title || !column_id) {
      return NextResponse.json(
        { error: "Title and column_id are required" },
        { status: 400 },
      );
    }

    // Update the task in the database
    const { data: task, error } = (await supabase
      .from("tasks")
      .update({
        title: title.trim(), // Trim whitespace
        description: description?.trim() ?? null, // Handle optional description
        column_id, // New column position
        status: "todo", // Temporary fallback for old schema
      })
      .eq("id", id) // Match the specific task ID
      .eq("created_by_id", "anonymous") // Ensure it belongs to anonymous user
      .select(
        `
        *,
        subtasks (*)
      `,
      )
      .single()) as { data: any; error: any };

    // Handle database errors
    if (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: "Failed to update task" },
        { status: 500 },
      );
    }

    // Check if task was found and updated
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Return the updated task with subtasks
    return NextResponse.json(task);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/tasks/[id] - Delete a task
 *
 * This endpoint permanently removes a task from the database.
 * It also removes all associated subtasks due to foreign key constraints.
 *
 * URL Parameters:
 * - id: The unique identifier of the task to delete
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the task ID
 * @returns JSON response with success confirmation or error message
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Extract task ID from URL parameters
    const params = await context.params;
    const { id } = params;

    // Delete the task from the database
    // Note: This will also delete associated subtasks due to foreign key constraints
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id) // Match the specific task ID
      .eq("created_by_id", "anonymous"); // Ensure it belongs to anonymous user

    // Handle database errors
    if (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 },
      );
    }

    // Return success confirmation
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
