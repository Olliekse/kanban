-- Supabase SQL Schema for Kanban Board
-- Run this in your Supabase SQL Editor

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_id TEXT NOT NULL DEFAULT 'anonymous'
);

-- Create subtasks table
CREATE TABLE subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_by_id ON tasks(created_by_id);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for now)
CREATE POLICY "Allow anonymous read access to tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to tasks" ON tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to tasks" ON tasks
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access to tasks" ON tasks
  FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access to subtasks" ON subtasks
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to subtasks" ON subtasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to subtasks" ON subtasks
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access to subtasks" ON subtasks
  FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
