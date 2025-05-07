import React, { useState, useEffect, useRef } from 'react'

// Extend the Window interface to include Leaflet
declare global { interface Window { L: any } }

interface Destination {
  name: string
  dates: string
  lat?: number
  lng?: number
}

interface DestinationsMapProps {
  destinations: Destination[]
  editable: boolean
  onSave: (destinations: Destination[]) => Promise<void>
}

const DestinationsMap: React.FC<DestinationsMapProps> = ({
  destinations,
  editable,
  onSave,
}) => {
  // Keep local in sync with props so markers survive reloads
  const [localDestinations, setLocalDestinations] = useState(destinations || [])
  useEffect(() => {
    setLocalDestinations(destinations || [])
  }, [destinations])

  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)

  // Init map once
  useEffect(() => {
    if (typeof window === 'undefined') return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity =
      'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = initializeMap
    document.body.appendChild(script)

    return () => {
      if (leafletMapRef.current) leafletMapRef.current.remove()
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  // Re-draw markers & polyline when data changes
  useEffect(() => {
    if (leafletMapRef.current && markersLayerRef.current) {
      updateMarkers()
    }
  }, [localDestinations])

  function initializeMap() {
    if (!mapRef.current || !window.L) return
    const L = window.L
    leafletMapRef.current = L.map(mapRef.current).setView([20, 0], 2)

    // German-hosted tiles (English labels)
    L.tileLayer(
      'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png',
      { attribution: 'Your Attribute' }
    ).addTo(leafletMapRef.current)

    // Use a featureGroup so getBounds() works
    markersLayerRef.current = L.featureGroup().addTo(leafletMapRef.current)
    updateMarkers()

    // If you want drag-to-move in edit mode,
    // hook marker.on('dragend') here and call onSave(updated)
  }

  function updateMarkers() {
    const L = window.L
    markersLayerRef.current.clearLayers()

    // Add markers
    localDestinations.forEach((dest, i) => {
      if (dest.lat != null && dest.lng != null) {
        const marker = L.marker([dest.lat, dest.lng], { draggable: false })
        marker.bindPopup(`<strong>${dest.name}</strong><br/>${dest.dates}`)
        marker.addTo(markersLayerRef.current)
      }
    })

    // Draw connecting line
    const latlngs = localDestinations
      .filter(d => d.lat != null && d.lng != null)
      .map(d => [d.lat, d.lng])
    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: '#4FD1C5', weight: 3 }).addTo(
        markersLayerRef.current
      )
    }

    // Fit map to all markers
    const bounds = markersLayerRef.current.getBounds()
    if (bounds.isValid()) {
      leafletMapRef.current.fitBounds(bounds, { padding: [40, 40] })
    }
  }

  return <div ref={mapRef} className="w-full h-full" />
}

export default DestinationsMap
