import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const boardId = params.id;

    if (!boardId) {
      return NextResponse.json(
        { error: "Board ID is required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Delete the board (this will cascade delete columns and tasks due to foreign key constraints)
    const { error } = await supabase.from("boards").delete().eq("id", boardId);

    if (error) {
      console.error("Error deleting board:", error);
      return NextResponse.json(
        { error: "Failed to delete board" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/boards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
