import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, board_id } = body;

    if (!name || !board_id) {
      return NextResponse.json(
        { error: "Column name and board ID are required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Create the column
    const { data: column, error: columnError } = await supabase
      .from("board_columns")
      .insert([
        {
          name: name.trim(),
          board_id: board_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (columnError) {
      console.error("Error creating column:", columnError);
      return NextResponse.json(
        { error: "Failed to create column" },
        { status: 500 },
      );
    }

    return NextResponse.json(column, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/columns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
