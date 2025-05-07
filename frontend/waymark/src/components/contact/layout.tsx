import type React from "react"

export default function SupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white pt-100 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">Support</h1>
      </div>
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  )
}
