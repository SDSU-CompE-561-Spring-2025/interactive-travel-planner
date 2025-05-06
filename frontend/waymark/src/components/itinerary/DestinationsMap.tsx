'use client'
// src/components/itinerary/DestinationsMap.tsx
import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface Dest { name: string; dates: string; coords: [number, number] }

export default function DestinationsMap({ destinations }: { destinations: Dest[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !destinations.length) return;
    
    // This would normally import an actual map library like Leaflet or Google Maps
    // For this demo, we'll create a simple visual representation
    const container = mapRef.current;
    container.innerHTML = ''; // Clear previous content
    container.style.position = 'relative';
    
    // Create a fake "map" background
    const mapBackground = document.createElement('div');
    mapBackground.style.position = 'absolute';
    mapBackground.style.inset = '0';
    mapBackground.style.backgroundColor = '#e5f2f7';
    mapBackground.style.borderRadius = '4px';
    container.appendChild(mapBackground);
    
    // Add some fake "terrain" details
    for (let i = 0; i < 8; i++) {
      const terrain = document.createElement('div');
      terrain.style.position = 'absolute';
      terrain.style.width = `${Math.random() * 30 + 20}%`;
      terrain.style.height = `${Math.random() * 20 + 10}%`;
      terrain.style.backgroundColor = '#d3e8ef';
      terrain.style.borderRadius = '50%';
      terrain.style.top = `${Math.random() * 80}%`;
      terrain.style.left = `${Math.random() * 80}%`;
      terrain.style.opacity = '0.6';
      mapBackground.appendChild(terrain);
    }
    
    // Find the min/max coordinates to normalize the positions
    const lats = destinations.map(d => d.coords[0]);
    const longs = destinations.map(d => d.coords[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLong = Math.min(...longs);
    const maxLong = Math.max(...longs);
    
    // Helper to normalize coords
    const normalize = (value: number, min: number, max: number) => {
      // Pad by 15% on each side
      const range = max - min;
      const padded_min = min - range * 0.15;
      const padded_max = max + range * 0.15;
      return ((value - padded_min) / (padded_max - padded_min) * 80) + 10; // 10% margin
    };
    
    // Add markers for each destination
    destinations.forEach((dest, index) => {
      // Calculate position as percentage of container
      const top = normalize(dest.coords[0], minLat, maxLat);
      const left = normalize(dest.coords[1], minLong, maxLong);
      
      // Create marker
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.top = `${100 - top}%`; // Invert Y-axis for map coords
      marker.style.left = `${left}%`;
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.zIndex = '10';
      
      // Marker dot
      const dot = document.createElement('div');
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = '#0ea5e9';
      dot.style.borderRadius = '50%';
      dot.style.border = '2px solid white';
      dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      marker.appendChild(dot);
      
      // Label
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.top = '12px';
      label.style.left = '0';
      label.style.backgroundColor = 'white';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '4px';
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      label.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      label.style.whiteSpace = 'nowrap';
      label.style.transform = 'translateX(-50%)';
      label.textContent = dest.name;
      marker.appendChild(label);
      
      // Add to map
      container.appendChild(marker);
      
      // Add route lines between destinations (except for the last one)
      if (index < destinations.length - 1) {
        const nextDest = destinations[index + 1];
        const nextTop = normalize(nextDest.coords[0], minLat, maxLat);
        const nextLeft = normalize(nextDest.coords[1], minLong, maxLong);
        
        // Create route line
        const route = document.createElement('div');
        route.style.position = 'absolute';
        route.style.zIndex = '5';
        
        // Calculate line position and dimensions
        const x1 = left;
        const y1 = 100 - top;
        const x2 = nextLeft;
        const y2 = 100 - nextTop;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        
        route.style.width = `${length}%`;
        route.style.height = '2px';
        route.style.backgroundColor = '#0ea5e9';
        route.style.opacity = '0.6';
        route.style.top = `${y1}%`;
        route.style.left = `${x1}%`;
        route.style.transformOrigin = '0 0';
        route.style.transform = `rotate(${angle}deg)`;
        
        container.appendChild(route);
      }
    });
    
  }, [destinations]);

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Destinations</h2>
      <ul className="space-y-2">
        {destinations.map((d) => (
          <li key={d.name} className="flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2" />
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-sm text-gray-500">{d.dates}</p>
            </div>
          </li>
        ))}
      </ul>
      <div ref={mapRef} className="h-64 bg-gray-100 relative overflow-hidden rounded-md">
        {/* Map will be rendered here */}
      </div>
    </Card>
  )
}