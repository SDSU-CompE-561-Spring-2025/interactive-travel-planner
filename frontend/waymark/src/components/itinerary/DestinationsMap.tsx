'use client'
// src/components/itinerary/DestinationsMap.tsx
import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, Navigation } from 'lucide-react'

interface Dest { name: string; dates: string; coords: [number, number] }

export default function DestinationsMap({ destinations }: { destinations: Dest[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !destinations.length) return;
    
    // This would normally use a real map library like Leaflet or Google Maps
    // For this demo, we'll create a visually appealing representation
    const container = mapRef.current;
    container.innerHTML = ''; // Clear previous content
    container.style.position = 'relative';
    
    // Create a stylish map background with gradient
    const mapBackground = document.createElement('div');
    mapBackground.style.position = 'absolute';
    mapBackground.style.inset = '0';
    mapBackground.style.background = 'linear-gradient(145deg, #e6f7ff 0%, #e5f2f7 40%, #daeaf1 100%)';
    mapBackground.style.borderRadius = '8px';
    container.appendChild(mapBackground);
    
    // Add decorative terrain elements
    for (let i = 0; i < 12; i++) {
      const terrain = document.createElement('div');
      terrain.style.position = 'absolute';
      terrain.style.width = `${Math.random() * 30 + 10}%`;
      terrain.style.height = `${Math.random() * 20 + 5}%`;
      terrain.style.backgroundColor = i % 2 === 0 ? '#d3e8ef' : '#c5dfe9';
      terrain.style.borderRadius = '50%';
      terrain.style.top = `${Math.random() * 80}%`;
      terrain.style.left = `${Math.random() * 80}%`;
      terrain.style.opacity = '0.4';
      mapBackground.appendChild(terrain);
    }
    
    // Find the min/max coordinates to normalize the positions
    const lats = destinations.map(d => d.coords[0]);
    const longs = destinations.map(d => d.coords[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLong = Math.min(...longs);
    const maxLong = Math.max(...longs);
    
    // Helper to normalize coordinates
    const normalize = (value: number, min: number, max: number) => {
      // Add padding of 15% on each side
      const range = max - min;
      const padded_min = min - range * 0.15;
      const padded_max = max + range * 0.15;
      return ((value - padded_min) / (padded_max - padded_min) * 80) + 10; // 10% margin
    };
    
    // Add connecting lines between destinations
    destinations.forEach((dest, index) => {
      if (index === destinations.length - 1) return; // Skip the last one
      
      const nextDest = destinations[index + 1];
      const startTop = normalize(dest.coords[0], minLat, maxLat);
      const startLeft = normalize(dest.coords[1], minLong, maxLong);
      const endTop = normalize(nextDest.coords[0], minLat, maxLat);
      const endLeft = normalize(nextDest.coords[1], minLong, maxLong);
      
      // Draw a curved path between points
      const pathContainer = document.createElement('div');
      pathContainer.style.position = 'absolute';
      pathContainer.style.top = '0';
      pathContainer.style.left = '0';
      pathContainer.style.width = '100%';
      pathContainer.style.height = '100%';
      pathContainer.style.zIndex = '5';
      pathContainer.style.pointerEvents = 'none';
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      // Calculate control point for the curve (slight rise in the middle)
      const ctrlX = (startLeft + endLeft) / 2;
      const ctrlY = 100 - Math.min(startTop, endTop) + 15; // Control point above the line
      
      // Create the curved path
      const d = `M ${startLeft}% ${100 - startTop}% Q ${ctrlX}% ${ctrlY}% ${endLeft}% ${100 - endTop}%`;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#3b82f6');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-dasharray', '5,3');
      
      // Add animation for dash effect
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'stroke-dashoffset');
      animate.setAttribute('from', '8');
      animate.setAttribute('to', '0');
      animate.setAttribute('dur', '1.5s');
      animate.setAttribute('repeatCount', 'indefinite');
      path.appendChild(animate);
      
      svg.appendChild(path);
      pathContainer.appendChild(svg);
      container.appendChild(pathContainer);
    });
    
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
      marker.style.zIndex = '20';
      
      // Marker dot with pulse effect
      const dot = document.createElement('div');
      dot.style.width = '16px';
      dot.style.height = '16px';
      dot.style.backgroundColor = '#0ea5e9';
      dot.style.borderRadius = '50%';
      dot.style.border = '3px solid white';
      dot.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      
      // Pulse effect
      const pulse = document.createElement('div');
      pulse.style.position = 'absolute';
      pulse.style.top = '50%';
      pulse.style.left = '50%';
      pulse.style.transform = 'translate(-50%, -50%)';
      pulse.style.width = '100%';
      pulse.style.height = '100%';
      pulse.style.backgroundColor = '#0ea5e9';
      pulse.style.borderRadius = '50%';
      pulse.style.opacity = '0';
      pulse.style.animation = 'pulse 2s infinite ease-out';
      
      // Add the animation keyframes to the document if they don't exist yet
      if (!document.getElementById('pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.innerHTML = `
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
            70% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      dot.appendChild(pulse);
      marker.appendChild(dot);
      
      // Label
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.top = '20px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%)';
      label.style.backgroundColor = 'white';
      label.style.padding = '4px 10px';
      label.style.borderRadius = '4px';
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
      label.style.whiteSpace = 'nowrap';
      label.style.zIndex = '10';
      label.textContent = dest.name;
      
      // Add a subtle pointer triangle
      const pointer = document.createElement('div');
      pointer.style.position = 'absolute';
      pointer.style.top = '-4px';
      pointer.style.left = '50%';
      pointer.style.transform = 'translateX(-50%) rotate(45deg)';
      pointer.style.width = '8px';
      pointer.style.height = '8px';
      pointer.style.backgroundColor = 'white';
      label.appendChild(pointer);
      
      marker.appendChild(label);
      container.appendChild(marker);
    });
    
    // Add compass rose to corner
    const compass = document.createElement('div');
    compass.style.position = 'absolute';
    compass.style.bottom = '10px';
    compass.style.right = '10px';
    compass.style.width = '40px';
    compass.style.height = '40px';
    compass.style.backgroundColor = 'white';
    compass.style.borderRadius = '50%';
    compass.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    compass.style.display = 'flex';
    compass.style.alignItems = 'center';
    compass.style.justifyContent = 'center';
    compass.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
      </svg>
    `;
    container.appendChild(compass);
    
  }, [destinations]);

  return (
    <Card className="space-y-6 p-6 shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Destinations</h2>
        <span className="text-sm text-gray-500">{destinations.length} locations</span>
      </div>
      
      <div ref={mapRef} className="h-72 relative overflow-hidden rounded-lg shadow-inner border border-gray-100">
        {/* Interactive map will be rendered here */}
      </div>
      
      <ul className="space-y-3">
        {destinations.map((d, i) => (
          <li key={d.name} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-grow">
              <p className="font-medium">{d.name}</p>
              <p className="text-sm text-gray-500">{d.dates}</p>
            </div>
            {i < destinations.length - 1 && (
              <div className="flex items-center text-xs text-gray-500 ml-2">
                <Navigation className="w-3 h-3 mr-1 rotate-45" /> 
                <span>Next stop</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}