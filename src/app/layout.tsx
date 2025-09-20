/**
 * Root Layout Component
 *
 * This is the main layout component that wraps our entire application. It sets up:
 * 1. Global styles and fonts
 * 2. Context providers for state management
 * 3. The main header component
 *
 * The context providers are nested in a specific order to ensure proper data flow:
 * ThemeProvider (outermost) -> BoardsProvider -> ModalProvider -> TasksProvider (innermost)
 */

"use client";

import Header from "@/components/Header";
import "@/styles/globals.css";
import { TasksProvider } from "@/contexts/TasksContext";
import BoardsModal from "@/components/BoardsModal";
import { ModalProvider } from "@/contexts/ModalContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BoardsProvider } from "@/contexts/BoardsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* 
          Load the Plus Jakarta Sans font from Google Fonts
          This font is used throughout the application for a modern, clean look
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* 
          Context Provider Hierarchy:
          
          ThemeProvider (outermost): Manages dark/light theme state
          BoardsProvider: Manages board selection and board data
          ModalProvider: Controls which modals are open/closed
          TasksProvider (innermost): Manages task data and drag-and-drop
          
          This order ensures that:
          - Theme context is available to all components
          - Board context is available to modals and tasks
          - Modal context can access board and task data
          - Task context can access all other contexts
        */}
        <ThemeProvider>
          <BoardsProvider>
            <ModalProvider>
              <TasksProvider>
                {/* Header component that appears on every page */}
                <Header />
                {/* Main content area - this is where page.tsx renders */}
                {children}
              </TasksProvider>
            </ModalProvider>
          </BoardsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
