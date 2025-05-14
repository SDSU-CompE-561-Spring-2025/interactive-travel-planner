import Link from "next/link"
import { MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-accent text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6" />
              <span className="font-bold text-xl">Waymark</span>
            </div>
            <p className="text-sm text-white/80">
              Plan your journey with ease. Create, organize, and share your travel itineraries.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="#" className="hover:text-white">
                  Trip Planning
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Itineraries
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Collaboration
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Budget Tracking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="#" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-sm text-white/60 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Waymark. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Twitter
            </Link>
            <Link href="#" className="hover:text-white">
              Instagram
            </Link>
            <Link href="#" className="hover:text-white">
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
