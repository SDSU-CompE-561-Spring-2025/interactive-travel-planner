import { ButtonCustom } from "@/components/ui/button-custom"
import Link from "next/link"
import { Calendar, MapPin, DollarSign, Users, CheckCircle, Share2 } from "lucide-react"

export default function SummaryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex rounded-full bg-[#4ba46c]/20 p-3">
          <CheckCircle className="h-8 w-8 text-[#4ba46c]" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Your Trip is Ready!</h1>
        <p className="text-lg text-gray-600">
          We've created your personalized travel itinerary based on your preferences.
        </p>
      </div>

      <div className="mb-10 overflow-hidden rounded-xl bg-white shadow-md">
        <div className="bg-[#f3a034] p-6 text-white">
          <h2 className="text-2xl font-bold">Summer Coastal Escape</h2>
          <p className="text-white/80">Your 7-day adventure in Bali</p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <Calendar className="mt-1 h-5 w-5 text-[#f3a034]" />
            <div>
              <h3 className="font-medium text-gray-800">Dates</h3>
              <p className="text-sm text-gray-600">June 15 - June 22, 2025</p>
              <p className="text-xs text-gray-500">7 days, 6 nights</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <MapPin className="mt-1 h-5 w-5 text-[#f3a034]" />
            <div>
              <h3 className="font-medium text-gray-800">Destination</h3>
              <p className="text-sm text-gray-600">Bali, Indonesia</p>
              <p className="text-xs text-gray-500">Tropical paradise</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <DollarSign className="mt-1 h-5 w-5 text-[#f3a034]" />
            <div>
              <h3 className="font-medium text-gray-800">Budget</h3>
              <p className="text-sm text-gray-600">$2,000 total</p>
              <p className="text-xs text-gray-500">~$285 per day</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <Users className="mt-1 h-5 w-5 text-[#f3a034]" />
            <div>
              <h3 className="font-medium text-gray-800">Travelers</h3>
              <p className="text-sm text-gray-600">You + 2 friends</p>
              <p className="text-xs text-gray-500">Collaboration enabled</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Daily Itinerary Highlights</h3>

          <div className="space-y-4">
            {[
              { day: "Day 1", activity: "Arrival & Beach Welcome Dinner" },
              { day: "Day 2", activity: "Ubud Rice Terraces & Cultural Tour" },
              { day: "Day 3", activity: "Mount Batur Sunrise Trek" },
              { day: "Day 4", activity: "Nusa Penida Island Exploration" },
              { day: "Day 5", activity: "Uluwatu Temple & Kecak Dance" },
              { day: "Day 6", activity: "Relaxation Day & Spa Treatment" },
              { day: "Day 7", activity: "Departure Day" },
            ].map((item, index) => (
              <div key={index} className="flex border-l-2 border-[#4ba46c] pl-4">
                <div className="min-w-24">
                  <p className="font-medium text-[#4ba46c]">{item.day}</p>
                </div>
                <div>
                  <p className="text-gray-700">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <ButtonCustom variant="primary" size="lg">
          View Full Itinerary
        </ButtonCustom>

        <ButtonCustom variant="outline" size="lg">
          <Share2 className="mr-2 h-4 w-4" />
          Share with Friends
        </ButtonCustom>

        <Link href="/">
          <ButtonCustom variant="secondary" size="lg">
            Back to Home
          </ButtonCustom>
        </Link>
      </div>
    </div>
  )
}
