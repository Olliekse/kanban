import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, columns } = body;

    if (!name || !columns || columns.length === 0) {
      return NextResponse.json(
        { error: "Board name and at least one column are required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Create the board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert([
        {
          name: name.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (boardError) {
      console.error("Error creating board:", boardError);
      return NextResponse.json(
        { error: "Failed to create board" },
        { status: 500 },
      );
    }

    // Create the columns
    const columnsData = columns.map((column: { name: string }) => ({
      name: column.name.trim(),
      board_id: board.id,
      created_at: new Date().toISOString(),
    }));

    const { error: columnsError } = await supabase
      .from("board_columns")
      .insert(columnsData);

    if (columnsError) {
      console.error("Error creating columns:", columnsError);
      // Clean up the board if column creation fails
      await supabase.from("boards").delete().eq("id", board.id);
      return NextResponse.json(
        { error: "Failed to create board columns" },
        { status: 500 },
      );
    }

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/boards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const supabase = createClient();

    const { data: boards, error } = await supabase
      .from("boards")
      .select(
        `
        *,
        board_columns (*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching boards:", error);
      return NextResponse.json(
        { error: "Failed to fetch boards" },
        { status: 500 },
      );
    }

    return NextResponse.json(boards);
  } catch (error) {
    console.error("Error in GET /api/boards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

