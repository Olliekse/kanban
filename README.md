# Kanban Board - Next.js + Supabase

A simple kanban board application built with Next.js and Supabase.

## Features

- ✅ Create tasks with title, description, and status
- ✅ Add subtasks to tasks
- ✅ Drag-and-drop functionality (coming soon)
- ✅ Real-time updates
- ✅ Responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Anonymous access (can be extended)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 1-2 minutes)

### 2. Set up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Run the SQL to create the tables

### 3. Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon public key

### 4. Set up Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Install Dependencies and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your kanban board!

## Project Structure

```
src/
├── app/
│   ├── api/tasks/          # API routes for task operations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main kanban board page
├── components/
│   └── TaskModal.tsx       # Modal for creating tasks
└── lib/
    └── supabase.ts         # Supabase client configuration
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

## Why This Stack?

This project uses a simplified full-stack approach that's perfect for junior developers:

- **Next.js API Routes**: Simple, built-in backend functionality
- **Supabase**: Handles database, auth, and real-time features
- **No complex setup**: No tRPC, Prisma, or complex authentication
- **Industry relevant**: Technologies used by many companies
- **Easy to understand**: Straightforward HTTP requests and responses

## Next Steps

- Add drag-and-drop functionality
- Implement user authentication
- Add task editing capabilities
- Add real-time updates
- Deploy to Vercel

## Deployment

This project can be easily deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel
4. Deploy!

Your kanban board will be live and accessible from anywhere!
