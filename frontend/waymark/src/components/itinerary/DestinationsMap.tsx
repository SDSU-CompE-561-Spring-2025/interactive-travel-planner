// Enhanced DestinationsMap component with chronological lines
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Interface definitions
interface Destination {
  name: string;
  dates: string;
  lat?: number;
  lng?: number;
  color?: string;
  originalIndex?: number;
  id?: number | string;
}

interface DestinationsMapProps {
  destinations: Destination[];
  editable: boolean;
  onSave: () => Promise<void>;
}

// Empty placeholder component for SSR
const MapPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Client-side only map component
const DestinationsMapComponent: React.FC<DestinationsMapProps> = ({ destinations, editable, onSave }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Import Leaflet dynamically only on client side
  useEffect(() => {
    let L: any;
    let cleanup: (() => void) | undefined;

    const initializeLeaflet = async () => {
      try {
        // Dynamic import of Leaflet (client-side only)
        L = (await import('leaflet')).default;
        
        // Add Leaflet CSS manually
        if (typeof document !== 'undefined') {
          const linkExists = document.querySelector('link[href*="leaflet.css"]');
          if (!linkExists) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
          }
        }
        
        if (!mapContainerRef.current || mapRef.current) return;
        
        // Create map instance
        const map = L.map(mapContainerRef.current, {
          center: [20, 0], // Default center
          zoom: 2,
          minZoom: 2,
          maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Store map reference
        mapRef.current = map;
        setMapInitialized(true);
        setIsLoading(false);
        
        // Update markers
        updateMarkers(L, map);
        
        // Setup cleanup function
        cleanup = () => {
          if (mapRef.current) {
            try {
              // Clear all markers
              markersRef.current.forEach(marker => {
                if (mapRef.current) marker.removeFrom(mapRef.current);
              });
              markersRef.current = [];
              
              // Remove polyline
              if (polylineRef.current && mapRef.current) {
                polylineRef.current.removeFrom(mapRef.current);
                polylineRef.current = null;
              }
              
              // Remove map
              mapRef.current.remove();
              mapRef.current = null;
              setMapInitialized(false);
            } catch (error) {
              console.error('Error cleaning up map:', error);
            }
          }
        };
      } catch (error) {
        console.error('Error initializing Leaflet:', error);
        setIsLoading(false);
      }
    };

    // Initialize Leaflet after a small delay
    const timer = setTimeout(initializeLeaflet, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, []);

  // Update markers when destinations change
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;
    
    // Dynamic import of Leaflet for updating markers
    const updateMapMarkers = async () => {
      const L = (await import('leaflet')).default;
      updateMarkers(L, mapRef.current);
    };
    
    const timer = setTimeout(updateMapMarkers, 100);
    
    return () => clearTimeout(timer);
  }, [destinations, mapInitialized]);

  // Parse YYYY-MM-DD into Date
  const parseLocalDate = (d: string) => {
    try {
      const [y, m, day] = d.split('-').map(Number);
      return new Date(y, m - 1, day);
    } catch (e) {
      console.error('Error parsing date:', d, e);
      return new Date(); // Return current date as fallback
    }
  };

  // Sort destinations by date
  const sortDestinationsByDate = (dests: Destination[]) => {
    return [...dests].sort((a, b) => {
      if (!a.dates || !b.dates) return 0;
      
      try {
        const aStartDate = a.dates.split(',')[0].trim();
        const bStartDate = b.dates.split(',')[0].trim();
        return parseLocalDate(aStartDate).getTime() - parseLocalDate(bStartDate).getTime();
      } catch (e) {
        console.error('Error sorting destinations:', e);
        return 0;
      }
    });
  };

  // Function to update map markers
  const updateMarkers = async (L: any, map: any) => {
    if (!map) return;
    
    try {
      // Remove existing markers
      markersRef.current.forEach(marker => {
        try {
          marker.removeFrom(map);
        } catch (e) {
          console.error('Error removing marker:', e);
        }
      });
      markersRef.current = [];
      
      // Remove existing polyline
      if (polylineRef.current) {
        try {
          polylineRef.current.removeFrom(map);
          polylineRef.current = null;
        } catch (e) {
          console.error('Error removing polyline:', e);
        }
      }
      
      // Get pastel colors array
      const pastelColors = [
        '#66C5CC', '#F6C571', '#F89C74', '#DCB0F2',
        '#87C55F', '#9EB9F3', '#FEBB81', '#C9D874',
        '#8DE0A4', '#B497E7', '#B3B3B3',
      ];
      
      // If no valid destinations, just return
      const validDestinations = destinations.filter(
        d => d.lat !== undefined && d.lng !== undefined
      );
      
      if (validDestinations.length === 0) return;
      
      // Sort destinations chronologically
      const sortedDestinations = sortDestinationsByDate(validDestinations);
      
      // Add new markers
      const bounds = L.latLngBounds([]);
      const polylinePoints: [number, number][] = [];
      
      sortedDestinations.forEach((dest, i) => {
        if (dest.lat === undefined || dest.lng === undefined) return;
        
        try {
          // Add point to polyline
          polylinePoints.push([dest.lat, dest.lng]);
          
          // Create marker with popup
          const marker = L.marker([dest.lat, dest.lng])
            .bindPopup(`
              <strong>${dest.name}</strong><br/>
              ${dest.dates.split(',').map(d => d.trim()).join(' → ')}
            `)
            .setIcon(
              L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: ${
                  dest.color || pastelColors[i % pastelColors.length]
                }; width: 25px; height: 25px; border-radius: 50%; display: flex; 
                justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <span style="color: white; font-weight: bold; font-size: 10px;">${i + 1}</span>
                </div>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12],
              })
            );
          
          // Only add marker to map if map exists
          marker.addTo(map);
          markersRef.current.push(marker);
          bounds.extend([dest.lat, dest.lng]);
        } catch (e) {
          console.error('Error adding marker:', e);
        }
      });
      
      // Add polyline connecting destinations in chronological order
      if (polylinePoints.length > 1) {
        try {
          polylineRef.current = L.polyline(polylinePoints, {
            color: '#2563eb',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10',
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map);
        } catch (e) {
          console.error('Error adding polyline:', e);
        }
      }
      
      // Center and zoom map to fit all markers
      if (bounds.isValid()) {
        try {
          map.fitBounds(bounds, { padding: [50, 50] });
        } catch (e) {
          console.error('Error fitting bounds:', e);
        }
      }
    } catch (error) {
      console.error('Error updating map markers:', error);
    }
  };

  // Handle window resize (client-side only)
  useEffect(() => {
    if (!mapInitialized || typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (mapRef.current) {
        try {
          mapRef.current.invalidateSize();
        } catch (e) {
          console.error('Error invalidating map size:', e);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial invalidate size after a short delay
    const timer = setTimeout(handleResize, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [mapInitialized]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }}
        className="rounded-xl overflow-hidden"
      />
    </div>
  );
};

// Use dynamic import with SSR disabled for the map component
const DestinationsMap = dynamic(() => Promise.resolve(DestinationsMapComponent), {
  ssr: false, // This is important - prevents SSR
  loading: () => <MapPlaceholder />,
});

export default DestinationsMap;