"use client"

import Link from "next/link"
import Image from "next/image"
import { PlusCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trip-card"

export function UserTrips() {
  // Sample trips data - in a real app, this would be fetched from an API
    const trips = [
        {
        id: "trip1",
        title: "European Capitals Tour",
        image: "/placeholder.svg?height=300&width=500",
        destinations: ["Paris", "Berlin", "Rome", "Madrid"],
        startDate: "2024-06-10",
        endDate: "2024-06-24",
        collaborators: [
            { id: "user456", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" },
            { id: "user789", name: "Mike Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        ],
        },
        {
        id: "trip2",
        title: "Southeast Asia Adventure",
        image: "/placeholder.svg?height=300&width=500",
        destinations: ["Bangkok", "Singapore", "Bali", "Ho Chi Minh"],
        startDate: "2024-09-05",
        endDate: "2024-09-26",
        collaborators: [{ id: "user456", name: "Jane Smith", avatar: "/placeholder.svg?height=40&width=40" }],
        },
        {
        id: "trip3",
        title: "Japan Cherry Blossom Tour",
        image: "/placeholder.svg?height=300&width=500",
        destinations: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
        startDate: "2025-04-01",
        endDate: "2025-04-10",
        collaborators: [],
        },
    ]

    return (
        <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Trips</h2>
            <Button asChild>
            <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Trip
            </Link>
            </Button>
        </div>

        {trips.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-4">Start planning your first adventure!</p>
            <Button asChild>
                <Link href="/create">Create New Trip</Link>
            </Button>
            </div>
        ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
            ))}
            </div>
        )}
        </div>
    )
    }
