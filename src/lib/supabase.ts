import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();

export interface Task {
  id: string;
  title: string;
  description?: string;
  column_id: string;
  board_id: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  task_id: string;
}
