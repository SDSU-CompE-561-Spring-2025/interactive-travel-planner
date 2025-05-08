'use client'

import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Trip = {
  id: number
  name: string
  destination: string
  start_date: string
  end_date: string
  image?: string
}

const sampleTrips: Trip[] = [
  {
    id: 1,
    name: "Spring in Kyoto",
    destination: "Kyoto, Japan",
    start_date: "2025-05-20",
    end_date: "2025-05-28",
    image: "https://boutiquejapan.com/wp-content/uploads/2019/07/yasaka-pagoda-higashiyama-kyoto-japan.jpg",
  },
  {
    id: 2,
    name: "Beach Escape",
    destination: "Maui, Hawaii",
    start_date: "2025-06-10",
    end_date: "2025-06-17",
    image: "https://freedomdestinations.co.uk/wp-content/uploads/HonoluluHawaii.jpg",
  },
  {
    id: 3,
    name: "City Lights",
    destination: "New York, USA",
    start_date: "2025-07-01",
    end_date: "2025-07-07",
    image: "https://i.natgeofe.com/k/5b396b5e-59e7-43a6-9448-708125549aa1/new-york-statue-of-liberty.jpg",
  },
  {
    id: 4,
    name: "Euro Tour",
    destination: "Paris, France",
    start_date: "2025-08-12",
    end_date: "2025-08-25",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/960px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
  },
  {
    id: 5,
    name: "Nordic Adventure",
    destination: "Oslo, Norway",
    start_date: "2025-09-15",
    end_date: "2025-09-22",
    image: "https://miro.medium.com/v2/resize:fit:1400/0*uzryjySGRMRPuCTh",
  },
  {
    id: 6,
    name: "Desert Dreams",
    destination: "Dubai, UAE",
    start_date: "2025-10-03",
    end_date: "2025-10-10",
    image: "https://cdn.britannica.com/15/189715-050-4310222B/Dubai-United-Arab-Emirates-Burj-Khalifa-top.jpg",
  },
]

export default function TripsPage() {
  const trips = sampleTrips
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleString("default", { month: "short" })
    const day = date.getDate()
    return `${month} ${day}`
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const tripDate = new Date(dateString)
    const diffTime = tripDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="bg-[#fff8f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#377c68] py-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-normal text-white">My Trips</h1>
          <p className="text-white/90 mt-1 text-sm sm:text-base">
            Your journey begins with a single step
          </p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <p className="text-[#4ba46c] text-base">
            You have {trips.length} upcoming adventures
          </p>
          <Button className="bg-white hover:bg-white/90 text-black border-0 font-normal text-sm sm:text-base px-3 py-2" onClick={() => router.push('/planner/start')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const daysUntil = getDaysUntil(trip.start_date)

            return (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-all duration-300 border-[#f3a034]/20 hover:border-[#f3a034]/40">
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <img
                      src={trip.image || "https://via.placeholder.com/400x250?text=Trip"}
                      alt={trip.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {daysUntil > 0 && daysUntil < 30 && (
                      <Badge className="absolute top-3 right-3 z-20 bg-[#f3a034] hover:bg-[#f3a034] text-white font-normal text-xs">
                        In {daysUntil} days
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <h2 className="text-xl font-semibold text-[#377c68]">{trip.name}</h2>
                    <div className="flex items-center text-[#4ba46c] text-lg">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <p className="font-normal">{trip.destination}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6 text-lg text-gray-600 font-normal">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-1 flex-shrink-0" />
                      <p>
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-[#377c68] underline text-lg">View details</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
