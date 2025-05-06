// src/app/planner/layout.tsx

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <main className="w-full max-w-2xl p-6">{children}</main>
      </div>
    );
  }
  