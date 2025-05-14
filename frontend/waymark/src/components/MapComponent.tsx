"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

type Destination = {
  id: string
  name: string
  location: [number, number]
  startDate: Date | undefined
  endDate: Date | undefined
  comments: string
  color: string
}

const createNumberedIcon = (number: number, color: string) => {
  return L.divIcon({
    className: "custom-numbered-icon",
    html: `<div style="background-color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; border: 3px solid ${color}; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${number}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

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

const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

// Create a client-only map component
const ClientMap = ({
  destinations,
  center,
  zoom,
  onSelectDestination,
  onMapMove,
}: {
  destinations: Destination[]
  center: [number, number]
  zoom: number
  onSelectDestination: (destination: Destination) => void
  onMapMove: (center: [number, number], zoom: number) => void
}) => {
  const mapInitialized = useRef(false)

  // Fix Leaflet icons on first render
  useEffect(() => {
    if (!mapInitialized.current) {
      fixLeafletIcons()
      mapInitialized.current = true
    }
  }, [])

  // Sort destinations by date
  const sortedDestinations = [...destinations].sort((a, b) => {
    if (!a.startDate) return 1
    if (!b.startDate) return -1
    return a.startDate.getTime() - b.startDate.getTime()
  })

  // Get polyline coordinates
  const polylinePositions = sortedDestinations.filter((dest) => dest.startDate).map((dest) => dest.location)

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        whenReady={() => {
          // Map is ready
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={center} zoom={zoom} onMapMove={onMapMove} />

        {/* Polyline connecting destinations */}
        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} color="#666" weight={3} opacity={0.7} dashArray="5, 8" />
        )}

        {sortedDestinations.map((dest, index) => (
          <Marker
            key={dest.id}
            position={dest.location}
            icon={createNumberedIcon(index + 1, dest.color)}
            eventHandlers={{
              click: () => onSelectDestination(dest),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="h-2 w-full rounded-t-sm mb-2" style={{ backgroundColor: dest.color }}></div>
                <h3 className="font-bold text-base">{dest.name}</h3>
                {dest.startDate && dest.endDate && (
                  <p className="text-sm text-gray-600 mt-1">
                    {dest.startDate.toLocaleDateString()} - {dest.endDate.toLocaleDateString()}
                  </p>
                )}
                {dest.comments && <p className="text-sm mt-2 text-gray-700">{dest.comments}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

// Wrap the client map in a dynamic import with no SSR
const ClientMapWithNoSSR = dynamic(() => Promise.resolve(ClientMap), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "100%",
      width: "100%",
      backgroundColor: "#f8fafc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
})

// Main component that handles mounting state
export default function MapComponent(props: {
  destinations: Destination[]
  center: [number, number]
  zoom: number
  onSelectDestination: (destination: Destination) => void
  onMapMove: (center: [number, number], zoom: number) => void
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <ClientMapWithNoSSR {...props} />
}
