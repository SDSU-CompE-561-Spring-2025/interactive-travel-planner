"use client"

import Link from "next/link"
import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import AuthContext from "@/app/context/AuthContext"
import { UserMenu } from "./user-menu"
import Logo from "./Logo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useContext(AuthContext)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/dashboard") ? "text-primary" : "text-foreground"
            }`}
          >
            My Trips
          </Link>
          <Link
                  href="/planner/start"
            className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/planner/start") ? "text-primary" : "text-foreground"
            }`}
          >
            Create Trip
          </Link>
              </>
            )}
        </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          ) : (
            <>
          <Link href="/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-white hover:bg-primary/90">Sign Up</Button>
          </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard") ? "text-primary" : "text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Trips
            </Link>
            <Link
                  href="/planner/start"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/planner/start") ? "text-primary" : "text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Create Trip
            </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary text-white hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
