"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with Next.js
const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  name: string;
  coordinates: [number, number];
  date?: string;
}

interface MapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showRoutes?: boolean;
  routeColor?: string;
}

// Create a client-side only map component
const MapComponent = ({ 
  locations, 
  center = [0, 0], 
  zoom = 2, 
  className = "h-[400px]",
  showRoutes = true,
  routeColor = "#3b82f6" // blue-500
}: MapProps) => {
  // Dynamically import Leaflet CSS to avoid SSR issues
  useEffect(() => {
    import('leaflet/dist/leaflet.css');
  }, []);

  // Create route points array for the polyline
  const routePoints = locations.map(loc => loc.coordinates);

  return (
    <div className={`relative w-full ${className}`} style={{ minHeight: '400px' }}>
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          min-height: 400px;
          border-radius: 0.5rem;
          z-index: 1;
        }
        .leaflet-control-container .leaflet-control {
          z-index: 2;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Draw routes between locations if enabled and we have more than one location */}
        {showRoutes && routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: routeColor,
              weight: 3,
              opacity: 0.7,
              dashArray: '5, 10', // Creates a dashed line effect
            }}
          />
        )}

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            icon={icon}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{location.name}</h3>
                {location.date && (
                  <p className="text-sm text-gray-600">{location.date}</p>
                )}
                {index < locations.length - 1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Next: {locations[index + 1].name}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Export the component as default for dynamic import
export default MapComponent;
// Also export as named export for direct imports
export { MapComponent as Map }; 