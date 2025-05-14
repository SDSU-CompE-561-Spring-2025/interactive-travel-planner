"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet icon paths
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

// Map controller component to handle external state changes
function MapController({
  center,
  zoom,
  onMapMove,
}: {
  center: [number, number]
  zoom: number
  onMapMove: (center: [number, number], zoom: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter()
      onMapMove([center.lat, center.lng], map.getZoom())
    }

    map.on("moveend", handleMoveEnd)

    return () => {
      map.off("moveend", handleMoveEnd)
    }
  }, [map, onMapMove])

  return null
}

export interface Location {
  id: string
  name: string
  coordinates: [number, number]
  description?: string
}

interface ItineraryMapProps {
  locations: Location[]
  center: [number, number]
  zoom: number
  onSelectLocation: (location: Location) => void
  onMapMove: (center: [number, number], zoom: number) => void
  onMapClick?: (coordinates: [number, number]) => void
}

export default function ItineraryMap({
  locations,
  center,
  zoom,
  onSelectLocation,
  onMapMove,
  onMapClick,
}: ItineraryMapProps) {
  const mapInitialized = useRef(false)

  // Fix Leaflet icons on first render
  useEffect(() => {
    if (!mapInitialized.current) {
      fixLeafletIcons()
      mapInitialized.current = true
    }
  }, [])

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%" }} 
      scrollWheelZoom={true}
      onClick={(e) => onMapClick?.(e.latlng as [number, number])}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController center={center} zoom={zoom} onMapMove={onMapMove} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.coordinates}
          eventHandlers={{
            click: () => onSelectLocation(location),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-base">{location.name}</h3>
              {location.description && (
                <p className="text-sm text-gray-600 mt-1">{location.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
} 