import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface CreateTaskRequest {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  subtasks?: Array<{ title: string }>;
}

// GET /api/tasks - Get all tasks
export async function GET() {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        subtasks (*)
      `,
      )
      .eq("created_by_id", "anonymous")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateTaskRequest;
    const { title, description, status, subtasks } = body;

    // Validate required fields
    if (!title || !status) {
      return NextResponse.json(
        { error: "Title and status are required" },
        { status: 400 },
      );
    }

    // Validate status
    if (!["todo", "in-progress", "done"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Create the task
    const { data: task, error: taskError } = (await supabase
      .from("tasks")
      .insert({
        title: title.trim(),
        description: description?.trim() ?? null,
        status,
        created_by_id: "anonymous",
      })
      .select()
      .single()) as { data: { id: string } | null; error: any };

    if (taskError) {
      console.error("Error creating task:", taskError);
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 },
      );
    }

    if (!task) {
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 },
      );
    }

    // Create subtasks if provided
    if (subtasks && subtasks.length > 0) {
      const validSubtasks = subtasks
        .filter((subtask) => subtask.title?.trim())
        .map((subtask) => ({
          title: subtask.title.trim(),
          task_id: (task as { id: string }).id,
        }));

      if (validSubtasks.length > 0) {
        const { error: subtasksError } = await supabase
          .from("subtasks")
          .insert(validSubtasks);

        if (subtasksError) {
          console.error("Error creating subtasks:", subtasksError);
          // Don't fail the whole request, just log the error
        }
      }
    }

    // Fetch the complete task with subtasks
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

    if (fetchError) {
      console.error("Error fetching complete task:", fetchError);
      return NextResponse.json(
        { error: "Task created but failed to fetch complete data" },
        { status: 500 },
      );
    }

    return NextResponse.json(completeTask, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
