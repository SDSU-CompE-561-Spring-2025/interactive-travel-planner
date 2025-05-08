// app/about/layout.tsx
import type { ReactNode } from "react";
import "../../globals.css"; // adjust if your global styles are elsewhere

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <header className="border-b p-4 shadow-sm bg-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold">About Travel Planner</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
        <footer className="text-center text-sm text-gray-500 mt-12 mb-4">
          &copy; {new Date().getFullYear()} Travel Planner.
        </footer>
      </body>
    </html>
  );
}
