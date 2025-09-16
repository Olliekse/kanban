"use client";

import Header from "@/components/Header";
import "@/styles/globals.css";
import { TasksProvider } from "@/contexts/TasksContext";
import BoardsModal from "@/components/BoardsModal";

import { ModalProvider } from "@/contexts/ModalContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ModalProvider>
          <TasksProvider>
            <Header />
            {children}
          </TasksProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
