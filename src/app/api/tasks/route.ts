/**
 * Tasks API Route Handler
 *
 * This file handles HTTP requests for task operations at the /api/tasks endpoint.
 * It provides CRUD operations for tasks in our kanban application.
 *
 * Supported Operations:
 * - GET: Retrieve all tasks (optionally filtered by board)
 * - POST: Create a new task with optional subtasks
 *
 * Database Operations:
 * - Queries the 'tasks' table with related 'subtasks'
 * - Uses Supabase for database operations
 * - Implements proper error handling and validation
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Request interface for creating a new task
 *
 * This defines the expected structure of the request body
 * when creating a new task via POST request.
 */
interface CreateTaskRequest {
  title: string; // Task title (required)
  description?: string; // Optional task description
  column_id: string; // Which column the task belongs to (required)
  board_id: string; // Which board the task belongs to (required)
  subtasks?: Array<{ title: string }>; // Optional array of subtasks to create
}

/**
 * GET /api/tasks - Retrieve all tasks
 *
 * This endpoint fetches all tasks from the database, optionally filtered by board.
 * It includes related subtasks in the response.
 *
 * Query Parameters:
 * - board_id (optional): Filter tasks by specific board
 *
 * @param request - The incoming HTTP request
 * @returns JSON response with tasks array or error message
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("board_id");

    // Build the base query to fetch tasks with their subtasks
    let query = supabase
      .from("tasks")
      .select(
        `
        *,
        subtasks (*)
      `,
      )
      .eq("created_by_id", "anonymous") // Filter by anonymous user (for now)
      .order("created_at", { ascending: false }); // Most recent tasks first

    // Apply board filter if provided
    if (boardId) {
      query = query.eq("board_id", boardId);
    }

    // Execute the query
    const { data: tasks, error } = await query;

    // Handle database errors
    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }

    // Return the tasks data
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/tasks - Create a new task
 *
 * This endpoint creates a new task in the database with optional subtasks.
 * It performs validation, creates the task, and then creates any associated subtasks.
 *
 * Request Body:
 * - title: Task title (required)
 * - description: Optional task description
 * - column_id: Column ID where task belongs (required)
 * - board_id: Board ID where task belongs (required)
 * - subtasks: Optional array of subtask objects with title property
 *
 * @param request - The incoming HTTP request with task data
 * @returns JSON response with created task or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = (await request.json()) as CreateTaskRequest;
    const { title, description, column_id, board_id, subtasks } = body;

    // Log the incoming data for debugging
    console.log("Creating task with data:", {
      title,
      description,
      column_id,
      board_id,
      subtasks,
    });

    // Validate required fields
    if (!title || !column_id || !board_id) {
      console.error("Validation failed:", {
        title: !!title,
        column_id: !!column_id,
        board_id: !!board_id,
      });
      return NextResponse.json(
        { error: "Title, column_id, and board_id are required" },
        { status: 400 },
      );
    }

    // STEP 1: Create the main task in the database
    const { data: task, error: taskError } = (await supabase
      .from("tasks")
      .insert({
        title: title.trim(), // Trim whitespace
        description: description?.trim() ?? null, // Handle optional description
        column_id, // Column where task belongs
        board_id, // Board where task belongs
        status: "todo", // Temporary fallback for old schema
        created_by_id: "anonymous", // Anonymous user for now
      })
      .select()
      .single()) as { data: { id: string } | null; error: any };

    // Handle task creation errors
    if (taskError) {
      console.error("Error creating task:", taskError);
      return NextResponse.json(
        { error: `Failed to create task: ${taskError.message}` },
        { status: 500 },
      );
    }

    // Ensure task was created successfully
    if (!task) {
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 },
      );
    }

    // STEP 2: Create subtasks if provided
    if (subtasks && subtasks.length > 0) {
      // Filter out empty subtasks and prepare data
      const validSubtasks = subtasks
        .filter((subtask) => subtask.title?.trim()) // Only non-empty titles
        .map((subtask) => ({
          title: subtask.title.trim(),
          task_id: (task as { id: string }).id, // Link to parent task
        }));

      // Create subtasks if any valid ones exist
      if (validSubtasks.length > 0) {
        const { error: subtasksError } = await supabase
          .from("subtasks")
          .insert(validSubtasks);

        // Log subtask creation errors but don't fail the whole request
        if (subtasksError) {
          console.error("Error creating subtasks:", subtasksError);
          // Don't fail the whole request, just log the error
        }
      }
    }

    // STEP 3: Fetch the complete task with subtasks for response
    const { data: completeTask, error: fetchError } = (await supabase
      .from("tasks")
      .select(
        `
        *,
        subtasks (*)
      `,
      )
      .eq("id", (task as { id: string }).id)
      .single()) as { data: any; error: any };

    // Handle fetch errors
    if (fetchError) {
      console.error("Error fetching complete task:", fetchError);
      return NextResponse.json(
        { error: "Task created but failed to fetch complete data" },
        { status: 500 },
      );
    }

    // Return the complete task with subtasks
    return NextResponse.json(completeTask, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
