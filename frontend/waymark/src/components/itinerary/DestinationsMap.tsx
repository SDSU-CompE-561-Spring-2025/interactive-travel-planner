import React, { useEffect, useRef } from 'react';

declare global { interface Window { L: any; } }

interface Destination {
  name: string;
  dates: string;
  lat?: number;
  lng?: number;
}

interface DestinationsMapProps {
  destinations: Destination[];
  editable: boolean;
  onSave: (destinations: Destination[]) => Promise<void>;
}

// Pure map component: no add-button or modal inside
const DestinationsMap: React.FC<DestinationsMapProps> = ({ destinations, editable, onSave }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Initialize map and controls
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.body.appendChild(script);

    return () => {
      if (leafletMapRef.current) leafletMapRef.current.remove();
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  // Update markers whenever destinations change
  useEffect(() => {
    if (markersLayerRef.current) updateMarkers();
  }, [destinations]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;

    // Remove default zoom control, add English tooltips
    leafletMapRef.current = L.map(mapRef.current, { zoomControl: false }).setView([20, 0], 2);
    L.control.zoom({ zoomInTitle: 'Zoom in', zoomOutTitle: 'Zoom out' }).addTo(leafletMapRef.current);

    // Use German tile server with custom attribution
    L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png", { attribution: 'Your Attribute' }).addTo(leafletMapRef.current);

    // Marker layer and initial markers
    markersLayerRef.current = L.featureGroup().addTo(leafletMapRef.current);
    updateMarkers();
  };

  const updateMarkers = () => {
    const L = window.L;
    markersLayerRef.current.clearLayers();

    destinations.forEach((dest, i) => {
      if (dest.lat !== undefined && dest.lng !== undefined) {
        const marker = L.marker([dest.lat, dest.lng], {
          title: dest.name,
          draggable: editable,
        }).addTo(markersLayerRef.current);

        marker.bindPopup(
          `<div><strong>${dest.name}</strong><p>${dest.dates}</p></div>`
        );

        // If editable, allow dragging and save
        if (editable) {
          marker.on('dragend', (e: any) => {
            const { lat, lng } = e.target.getLatLng();
            const updated = destinations.map((d, idx) =>
              idx === i ? { ...d, lat, lng } : d
            );
            onSave(updated);
          });
        }
      }
    });

    // Fit map bounds to markers
    const bounds = markersLayerRef.current.getBounds();
    if (bounds.isValid()) {
      leafletMapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div className="flex-1 relative h-full">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default DestinationsMap;
