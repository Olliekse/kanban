import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface UpdateSubtaskRequest {
  completed: boolean;
}

// PUT /api/subtasks/[id] - Update a subtask
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateSubtaskRequest;
    const { completed } = body;

    const { data: subtask, error } = await supabase
      .from("subtasks")
      .update({ completed })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating subtask:", error);
      return NextResponse.json(
        { error: "Failed to update subtask" },
        { status: 500 },
      );
    }

    if (!subtask) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }

    return NextResponse.json(subtask);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

