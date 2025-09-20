/**
 * Supabase Configuration and Type Definitions
 *
 * This file handles the connection to Supabase (our database service) and defines
 * the TypeScript interfaces for our data models. Supabase is a Backend-as-a-Service
 * that provides PostgreSQL database, authentication, and real-time features.
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Environment variables for Supabase connection
// These are set in .env.local and are prefixed with NEXT_PUBLIC_ to make them
// available in the browser (client-side code)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a new Supabase client instance
 *
 * This function creates a connection to our Supabase project using the URL and
 * anonymous key. The anonymous key allows read/write access to our database tables
 * (based on Row Level Security policies we set up in Supabase).
 *
 * @returns A configured Supabase client instance
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Export a default client instance that can be used throughout the app
export const supabase = createClient();

/**
 * Task Interface
 *
 * Defines the structure of a task in our kanban board. Each task belongs to:
 * - A specific column (column_id) - determines which column it appears in
 * - A specific board (board_id) - allows multiple boards per user
 * - A user (created_by_id) - for future user authentication
 *
 * The timestamps (created_at, updated_at) are automatically managed by Supabase
 */
export interface Task {
  id: string; // Unique identifier (UUID from Supabase)
  title: string; // Task title (required)
  description?: string; // Optional task description
  column_id: string; // Which column this task belongs to
  board_id: string; // Which board this task belongs to
  created_at: string; // When the task was created (ISO string)
  updated_at: string; // When the task was last modified (ISO string)
  created_by_id: string; // User who created the task (for future auth)
}

/**
 * Subtask Interface
 *
 * Subtasks are smaller, actionable items within a task. They help break down
 * complex tasks into manageable pieces. Each subtask can be marked as completed
 * independently.
 */
export interface Subtask {
  id: string; // Unique identifier (UUID from Supabase)
  title: string; // Subtask description
  completed: boolean; // Whether this subtask is done
  task_id: string; // Which task this subtask belongs to
}
