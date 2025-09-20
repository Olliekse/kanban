# Kanban Board - Next.js + Supabase

A comprehensive kanban board application built with modern web technologies. This project demonstrates full-stack development skills using Next.js, React, TypeScript, and Supabase.

## Live site

https://kanban-steel-iota.vercel.app/

## Learning Objectives

This project is designed to help junior developers understand:

- **Full-stack development** with Next.js API routes
- **Database design** and relationships with PostgreSQL/Supabase
- **State management** using React Context API
- **Drag and drop** functionality with modern libraries
- **TypeScript** for type safety and better development experience
- **Responsive design** with Tailwind CSS
- **Component architecture** and reusability
- **Error handling** and loading states
- **Real-time updates** and optimistic UI patterns

## Features

- **Multi-board support** - Create and manage multiple kanban boards
- **Drag and drop** - Move tasks between columns with smooth animations
- **Task management** - Create, edit, and delete tasks with descriptions
- **Subtask support** - Break down tasks into smaller, manageable pieces
- **Column management** - Add new columns to organize your workflow
- **Dark/Light theme** - Toggle between themes with persistent preferences
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time updates** - Changes sync immediately across the interface
- **Optimistic UI** - Instant feedback for better user experience

## Architecture Overview

### Frontend Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (backend)
│   │   ├── boards/        # Board CRUD operations
│   │   ├── tasks/         # Task CRUD operations
│   │   ├── columns/       # Column operations
│   │   └── subtasks/      # Subtask operations
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main kanban board page
├── components/            # Reusable UI components
│   ├── modals/           # Modal components for forms
│   ├── Header.tsx        # App header with theme toggle
│   └── ...
├── contexts/              # React Context providers
│   ├── TasksContext.tsx   # Task state management
│   ├── BoardsContext.tsx  # Board state management
│   ├── ModalContext.tsx   # Modal state management
│   └── ThemeContext.tsx   # Theme state management
└── lib/                   # Utility functions
    └── supabase.ts        # Database client configuration
```

### State Management Strategy

The application uses **React Context API** for state management, organized by domain:

1. **ThemeContext** - Manages dark/light theme preferences
2. **BoardsContext** - Handles board selection and board operations
3. **ModalContext** - Controls which modals are open/closed
4. **TasksContext** - Manages task data and drag-and-drop functionality

### Database Schema

```sql
-- Core entities and relationships
boards
├── id (UUID, Primary Key)
├── name (Text)
├── created_at (Timestamp)
└── updated_at (Timestamp)

board_columns
├── id (UUID, Primary Key)
├── name (Text)
├── board_id (UUID, Foreign Key → boards.id)
└── created_at (Timestamp)

tasks
├── id (UUID, Primary Key)
├── title (Text)
├── description (Text, Optional)
├── column_id (UUID, Foreign Key → board_columns.id)
├── board_id (UUID, Foreign Key → boards.id)
├── created_by_id (Text)
├── created_at (Timestamp)
└── updated_at (Timestamp)

subtasks
├── id (UUID, Primary Key)
├── title (Text)
├── completed (Boolean)
├── task_id (UUID, Foreign Key → tasks.id)
└── created_at (Timestamp)
```

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **@hello-pangea/dnd** - Drag and drop library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Real-time)
- **Zod** - Schema validation (for future use)

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd kanban
npm install
```

### 2. Set up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Set up the database schema**:

```sql
-- Create tables
CREATE TABLE boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE board_columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  column_id UUID REFERENCES board_columns(id) ON DELETE CASCADE,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  created_by_id TEXT DEFAULT 'anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous access to boards" ON boards FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to board_columns" ON board_columns FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow anonymous access to subtasks" ON subtasks FOR ALL USING (true);
```

3. **Get your Supabase credentials**:
   - Go to Settings → API
   - Copy your Project URL and anon public key

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your kanban board!

## Key Concepts Explained

### 1. Context API Pattern

```typescript
// Context provides state and functions to all child components
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Custom hook ensures proper usage
export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
```

**Why this pattern?**

- Avoids prop drilling (passing props through many components)
- Centralizes state management
- Provides type safety with TypeScript
- Makes testing easier

### 2. Optimistic Updates

```typescript
// Update UI immediately for better UX
setTasks(newTasks);

// Then sync with server
const response = await fetch(`/api/tasks/${draggableId}`, {
  method: "PUT",
  // ... update data
});

// Revert if server update fails
if (!response.ok) {
  setTasks(tasks); // Revert to original state
}
```

**Why optimistic updates?**

- Provides instant feedback to users
- Makes the app feel faster and more responsive
- Handles network delays gracefully

### 3. Drag and Drop Implementation

```typescript
// Using @hello-pangea/dnd library
<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId={column.id}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {/* Task content */}
              </div>
            )}
          </Draggable>
        ))}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

**Key concepts:**

- `DragDropContext` - Wraps the entire draggable area
- `Droppable` - Defines where items can be dropped
- `Draggable` - Makes individual items draggable
- `onDragEnd` - Handles the completion of a drag operation

### 4. API Route Structure

```typescript
// Next.js API routes are serverless functions
export async function GET(request: NextRequest) {
  // Handle GET requests
}

export async function POST(request: NextRequest) {
  // Handle POST requests
}
```

**Benefits:**

- No separate backend server needed
- Automatic TypeScript support
- Built-in request/response handling
- Easy deployment with Vercel

## UI/UX Features

### Responsive Design

- **Mobile-first approach** - Works on all screen sizes
- **Flexible grid layout** - Adapts to different numbers of columns
- **Touch-friendly** - Optimized for mobile interactions

### Theme System

- **CSS Custom Properties** - Easy theme switching
- **System preference detection** - Respects user's OS theme
- **Persistent storage** - Remembers user's theme choice

### Accessibility

- **Keyboard navigation** - Full keyboard support
- **Screen reader friendly** - Proper ARIA labels
- **High contrast support** - Works with system accessibility settings

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format:check # Check Prettier formatting
npm run format:write # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
```

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy!**

Your kanban board will be live and accessible from anywhere!

### Other Platforms

This project can be deployed to any platform that supports Next.js:

- **Netlify** - Static site hosting
- **Railway** - Full-stack hosting
- **DigitalOcean** - VPS hosting
- **AWS** - Cloud hosting

## Testing Strategy

While this project doesn't include tests yet, here's how you could add them:

```typescript
// Example test structure
describe("TasksContext", () => {
  it("should create a new task", async () => {
    // Test task creation logic
  });

  it("should handle drag and drop", async () => {
    // Test drag and drop functionality
  });
});
```

**Recommended testing libraries:**

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **Cypress** - End-to-end testing

## Future Enhancements

### Phase 1: Core Features

- [ ] User authentication and authorization
- [ ] Real-time collaboration
- [ ] Task due dates and priorities
- [ ] File attachments

### Phase 2: Advanced Features

- [ ] Advanced filtering and search
- [ ] Custom board templates
- [ ] Team management
- [ ] Analytics and reporting

### Phase 3: Enterprise Features

- [ ] SSO integration
- [ ] Advanced permissions
- [ ] API rate limiting
- [ ] Audit logs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learning Resources

### React & Next.js

- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API Guide](https://react.dev/learn/passing-data-deeply-with-context)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

### UI/UX

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Design System Best Practices](https://designsystemsrepo.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Vercel** for the excellent Next.js framework and deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **@hello-pangea/dnd** for the drag and drop functionality

---

**Happy coding!**

This project demonstrates modern web development practices and is perfect for building your portfolio as a junior developer. Feel free to customize it, add new features, and make it your own!
