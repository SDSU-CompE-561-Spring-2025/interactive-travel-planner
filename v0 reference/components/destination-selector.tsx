"use client"

import { useState } from "react"
import { Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Destination {
  id: string
  name: string
  country: string
}

interface DestinationSelectorProps {
  selectedDestinations: Destination[]
  onUpdate: (destinations: Destination[]) => void
}

export function DestinationSelector({ selectedDestinations, onUpdate }: DestinationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Destination[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Popular destinations for quick selection
  const popularDestinations: Destination[] = [
    { id: "paris", name: "Paris", country: "France" },
    { id: "rome", name: "Rome", country: "Italy" },
    { id: "barcelona", name: "Barcelona", country: "Spain" },
    { id: "london", name: "London", country: "United Kingdom" },
    { id: "tokyo", name: "Tokyo", country: "Japan" },
    { id: "newyork", name: "New York", country: "United States" },
    { id: "bali", name: "Bali", country: "Indonesia" },
    { id: "sydney", name: "Sydney", country: "Australia" },
  ]

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Filter popular destinations based on search term
      const results = popularDestinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      // Add some additional mock results
      if (searchTerm.toLowerCase().includes("a")) {
        results.push(
          { id: "amsterdam", name: "Amsterdam", country: "Netherlands" },
          { id: "athens", name: "Athens", country: "Greece" },
        )
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const addDestination = (destination: Destination) => {
    if (!selectedDestinations.some((d) => d.id === destination.id)) {
      onUpdate([...selectedDestinations, destination])
    }
    setSearchTerm("")
    setSearchResults([])
  }

  const removeDestination = (destinationId: string) => {
    onUpdate(selectedDestinations.filter((d) => d.id !== destinationId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for cities or countries"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button type="button" onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <ScrollArea className="h-48 rounded-md border p-2">
          <div className="space-y-1">
            {searchResults.map((destination) => (
              <Button
                key={destination.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => addDestination(destination)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {destination.name}, {destination.country}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Selected Destinations</label>
        {selectedDestinations.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            No destinations selected yet. Search for a city or country above.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedDestinations.map((destination) => (
              <Badge key={destination.id} variant="secondary" className="pl-2 pr-1 py-1.5">
                {destination.name}, {destination.country}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeDestination(destination.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Popular Destinations</label>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.slice(0, 6).map((destination) => (
            <Button
              key={destination.id}
              variant="outline"
              size="sm"
              onClick={() => addDestination(destination)}
              disabled={selectedDestinations.some((d) => d.id === destination.id)}
            >
              {destination.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
