/**
 * Batch Subtask Operations API Route Handler
 *
 * This file handles HTTP requests for batch subtask operations at the /api/subtasks/batch endpoint.
 * It provides operations for creating, updating, and deleting multiple subtasks at once.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface SubtaskOperation {
  id?: string;
  title: string;
  completed?: boolean;
  task_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, subtasks } = body as {
      taskId: string;
      subtasks: SubtaskOperation[];
    };

    if (!taskId || !Array.isArray(subtasks)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    // Delete all existing subtasks for this task
    const { error: deleteError } = await supabase
      .from("subtasks")
      .delete()
      .eq("task_id", taskId);

    if (deleteError) {
      console.error("Error deleting existing subtasks:", deleteError);
      return NextResponse.json(
        { error: "Failed to update subtasks" },
        { status: 500 },
      );
    }

    // Insert new subtasks if any exist
    if (subtasks.length > 0) {
      const subtasksToInsert = subtasks.map((subtask) => ({
        title: subtask.title.trim(),
        completed: subtask.completed ?? false,
        task_id: taskId,
      }));

      const { error: insertError } = await supabase
        .from("subtasks")
        .insert(subtasksToInsert);

      if (insertError) {
        console.error("Error inserting new subtasks:", insertError);
        return NextResponse.json(
          { error: "Failed to create new subtasks" },
          { status: 500 },
        );
      }
    }

    // Fetch and return the updated subtasks
    const { data: updatedSubtasks, error: fetchError } = await supabase
      .from("subtasks")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching updated subtasks:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch updated subtasks" },
        { status: 500 },
      );
    }

    return NextResponse.json({ subtasks: updatedSubtasks });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
