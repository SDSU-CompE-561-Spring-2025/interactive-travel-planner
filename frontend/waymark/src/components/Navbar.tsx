"use client"

import Link from "next/link"
import { Plane, Menu, X } from "lucide-react"
import { useState } from "react"
import { ButtonCustom } from "./ui/button-custom"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-[#f3a034]" />
          <span className="text-xl font-bold text-gray-900">Waymark</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#f3a034]">
            Home
          </Link>
          <Link href="/planner/start" className="text-sm font-medium text-gray-700 hover:text-[#f3a034]">
            Plan a Trip
          </Link>
          <Link href="/support" className="text-sm font-medium text-gray-700 hover:text-[#f3a034]">
            Support
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/sign-in">
            <ButtonCustom variant="outline">Sign In</ButtonCustom>
          </Link>
          <Link href="/sign-up">
            <ButtonCustom>Sign Up</ButtonCustom>
          </Link>
        </div>

        <button
          className="block md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white pt-16 md:hidden">
          <button className="absolute right-4 top-4" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>

          <nav className="flex flex-col items-center gap-6 p-8">
            <Link href="/" className="text-lg font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/planner/start"
              className="text-lg font-medium text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Plan a Trip
            </Link>
            <Link href="/support" className="text-lg font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>
              Support
            </Link>

            <div className="mt-6 flex w-full flex-col gap-4">
              <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                <ButtonCustom variant="outline" className="w-full">
                  Sign In
                </ButtonCustom>
              </Link>
              <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                <ButtonCustom className="w-full">Sign Up</ButtonCustom>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
