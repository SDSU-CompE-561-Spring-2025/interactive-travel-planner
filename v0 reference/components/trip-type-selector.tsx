"use client"

import type React from "react"

import {
  BeanIcon as Beach,
  Briefcase,
  Camera,
  Compass,
  Footprints,
  Heart,
  Home,
  Mountain,
  Palmtree,
  Utensils,
  Wine,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TripType {
  id: string
  name: string
  icon: React.ReactNode
}

interface TripTypeSelectorProps {
  selectedTypes: TripType[]
  onUpdate: (types: TripType[]) => void
}

export function TripTypeSelector({ selectedTypes, onUpdate }: TripTypeSelectorProps) {
  const tripTypes: TripType[] = [
    { id: "beach", name: "Beach", icon: <Beach className="h-4 w-4" /> },
    { id: "adventure", name: "Adventure", icon: <Compass className="h-4 w-4" /> },
    { id: "city", name: "City Break", icon: <Home className="h-4 w-4" /> },
    { id: "culture", name: "Cultural", icon: <Footprints className="h-4 w-4" /> },
    { id: "romantic", name: "Romantic", icon: <Heart className="h-4 w-4" /> },
    { id: "food", name: "Food & Drink", icon: <Utensils className="h-4 w-4" /> },
    { id: "nature", name: "Nature", icon: <Mountain className="h-4 w-4" /> },
    { id: "relaxation", name: "Relaxation", icon: <Palmtree className="h-4 w-4" /> },
    { id: "photography", name: "Photography", icon: <Camera className="h-4 w-4" /> },
    { id: "business", name: "Business", icon: <Briefcase className="h-4 w-4" /> },
    { id: "luxury", name: "Luxury", icon: <Wine className="h-4 w-4" /> },
  ]

  const toggleTripType = (type: TripType) => {
    if (selectedTypes.some((t) => t.id === type.id)) {
      onUpdate(selectedTypes.filter((t) => t.id !== type.id))
    } else {
      onUpdate([...selectedTypes, type])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tripTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedTypes.some((t) => t.id === type.id) ? "default" : "outline"}
            className="h-auto flex-col py-3"
            onClick={() => toggleTripType(type)}
          >
            <div className="mb-1">{type.icon}</div>
            <span>{type.name}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Selected Trip Types</label>
        {selectedTypes.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            No trip types selected yet. Select at least one type above.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <Badge key={type.id} className="flex items-center gap-1">
                {type.icon}
                <span>{type.name}</span>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
