import type React from "react"

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="mx-auto w-full max-w-4xl">{children}</main>
    </div>
  )
}
