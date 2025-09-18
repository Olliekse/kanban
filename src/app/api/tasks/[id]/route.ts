import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface UpdateTaskRequest {
  title: string;
  description?: string;
  column_id: string;
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateTaskRequest;
    const { title, description, column_id } = body;

    // Validate required fields
    if (!title || !column_id) {
      return NextResponse.json(
        { error: "Title and column_id are required" },
        { status: 400 },
      );
    }

    const { data: task, error } = (await supabase
      .from("tasks")
      .update({
        title: title.trim(),
        description: description?.trim() ?? null,
        column_id,
        status: "todo", // Temporary fallback for old schema
      })
      .eq("id", id)
      .eq("created_by_id", "anonymous")
      .select(
        `
        *,
        subtasks (*)
      `,
      )
      .single()) as { data: any; error: any };

    if (error) {
      console.error("Error updating task:", error);
      return NextResponse.json(
        { error: "Failed to update task" },
        { status: 500 },
      );
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("created_by_id", "anonymous");

    if (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
