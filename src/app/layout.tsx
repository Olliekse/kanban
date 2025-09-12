"use client";

import Header from "@/components/Header";
import "@/styles/globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const handleAddTask = () => {
    window.dispatchEvent(new CustomEvent('openTaskModal'))
  };

  return (
    <html>
      <body>
        <Header
          onAddTask={handleAddTask}
          
        />
        {children}
        
      </body>
    </html>
  );
}
