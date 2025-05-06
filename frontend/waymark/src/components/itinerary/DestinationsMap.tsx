'use client'
// src/components/itinerary/DestinationsMap.tsx
import { useEffect, useRef, useState } from 'react'
import { MapPin, Edit2, Save, Plus, Trash2, X, Check } from 'lucide-react'
import Script from 'next/script'

interface Dest { 
  name: string; 
  dates: string; 
  coords: [number, number];
}

interface DestinationsMapProps {
  destinations: Dest[];
  editable?: boolean;
  onSave?: (destinations: Dest[]) => Promise<void>;
}

export default function DestinationsMap({ 
  destinations, 
  editable = false,
  onSave
}: DestinationsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletMap, setLeafletMap] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDestinations, setEditingDestinations] = useState<Dest[]>([...destinations]);
  const [editingDestIndex, setEditingDestIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocodeResults, setGeocodeResults] = useState<any[]>([]);
  const [geocodeInput, setGeocodeInput] = useState('');
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  // Reset editing destinations when props change
  useEffect(() => {
    if (!isEditing) {
      setEditingDestinations([...destinations]);
    }
  }, [destinations, isEditing]);

  // Add the Leaflet CSS to the document head
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Initialize the map when Leaflet is loaded
  useEffect(() => {
    // Only proceed if mapRef exists, Leaflet is loaded, and we have destinations
    if (!mapLoaded || !mapRef.current) return;
    
    try {
      // Clear previous map if it exists
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null);
      }
      
      // Create the map
      const L = window.L;
      const map = L.map(mapRef.current, {
        scrollWheelZoom: false, // Disable scroll wheel zoom to prevent accidental zooming
        zoomControl: true,      // Show zoom controls
      });
      
      setLeafletMap(map);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create bounds object to fit all markers
      const bounds = L.latLngBounds([]);
      const markers: any[] = [];
      
      const destinationsToShow = isEditing ? editingDestinations : destinations;
      
      // Add markers for each destination
      if (destinationsToShow.length > 0) {
        destinationsToShow.forEach((dest, index) => {
          const position = [dest.coords[0], dest.coords[1]];
          bounds.extend(position);
          
          // Create custom marker icon
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div class="marker-pin" style="background-color: #0ea5e9; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          
          // Create marker with custom icon
          const marker = L.marker(position as [number, number], { 
            icon: customIcon,
            title: dest.name
          }).addTo(map);
          
          // Create popup with destination info
          const popupContent = `
            <div style="text-align: center; padding: 5px;">
              <h3 style="margin: 0 0 5px; font-size: 14px; font-weight: bold;">${dest.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${dest.dates}</p>
            </div>
          `;
          
          // Add popup to marker
          marker.bindPopup(popupContent);
          
          // Show popup if this destination is selected
          if (dest.name === selectedDest) {
            marker.openPopup();
          }
          
          // Add click handler to marker
          marker.on('click', () => {
            setSelectedDest(dest.name);
          });
          
          markers.push(marker);
        });
        
        // Draw route lines between destinations
        if (destinationsToShow.length > 1) {
          const routePoints = destinationsToShow.map(dest => [dest.coords[0], dest.coords[1]]);
          
          // Create polyline for route
          const route = L.polyline(routePoints as [number, number][], {
            color: '#0ea5e9',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 8', // Create dashed line for route
          }).addTo(map);
        }
        
        // Fit map to bounds with padding
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Set max zoom level
        if (map.getZoom() > 12) {
          map.setZoom(12);
        }
      } else {
        // Default view if no destinations
        map.setView([20, 0], 2);
      }
      
    } catch (error) {
      console.error('Error initializing Leaflet map:', error);
      if (mapRef.current) {
        renderFallbackMap();
      }
    }
    
    // Cleanup function
    return () => {
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null);
      }
    };
  }, [mapLoaded, destinations, selectedDest, isEditing, editingDestinations]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (!editable) return;
    
    if (isEditing) {
      handleSaveChanges();
    } else {
      // Reset to original data when entering edit mode
      setEditingDestinations([...destinations]);
      setIsEditing(true);
      setError(null);
    }
  };
  
  // Handle saving all changes
  const handleSaveChanges = async () => {
    if (!onSave) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      await onSave(editingDestinations);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save destinations. Please try again.');
      console.error('Error saving destinations:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle destination edit
  const handleDestEdit = (destIndex: number) => {
    setEditingDestIndex(destIndex);
  };
  
  // Handle destination save
  const handleDestSave = (destIndex: number) => {
    setEditingDestIndex(null);
  };
  
  // Update destination
  const updateDestination = (field: keyof Dest, value: string | [number, number], destIndex: number) => {
    const newDestinations = [...editingDestinations];
    newDestinations[destIndex] = {
      ...newDestinations[destIndex],
      [field]: value
    };
    setEditingDestinations(newDestinations);
  };
  
  // Add new destination
  const addDestination = () => {
    const newDestinations = [...editingDestinations];
    
    // Default new destination
    const newDest: Dest = {
      name: "New Destination",
      dates: new Date().toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      coords: [0, 0] // Default coordinates at center of map
    };
    
    if (leafletMap) {
      // Use center of current map view as default coords
      const center = leafletMap.getCenter();
      newDest.coords = [center.lat, center.lng];
    }
    
    newDestinations.push(newDest);
    setEditingDestinations(newDestinations);
    
    // Start editing the new destination immediately
    setEditingDestIndex(newDestinations.length - 1);
  };
  
  // Delete destination
  const deleteDestination = (destIndex: number) => {
    const newDestinations = [...editingDestinations];
    newDestinations.splice(destIndex, 1);
    setEditingDestinations(newDestinations);
  };
  
  // Discard changes
  const discardChanges = () => {
    setEditingDestinations([...destinations]);
    setIsEditing(false);
    setEditingDestIndex(null);
    setError(null);
  };
  
  // Geocode location search
  const searchLocation = async () => {
    if (!geocodeInput.trim()) return;
    
    setIsGeocodingLoading(true);
    setGeocodeResults([]);
    
    try {
      // Use Nominatim for geocoding (free and no API key required)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(geocodeInput)}`);
      const data = await response.json();
      
      setGeocodeResults(data);
    } catch (err) {
      console.error('Error geocoding:', err);
    } finally {
      setIsGeocodingLoading(false);
    }
  };
  
  // Select geocode result
  const selectGeocodeResult = (result: any) => {
    if (editingDestIndex === null) return;
    
    updateDestination('coords', [parseFloat(result.lat), parseFloat(result.lon)], editingDestIndex);
    setGeocodeResults([]);
    setGeocodeInput('');
  };
  
  // Fallback map if Leaflet fails to load
  const renderFallbackMap = () => {
    // Make sure mapRef.current exists
    if (!mapRef.current) return;
    
    mapRef.current.innerHTML = '';
    mapRef.current.style.position = 'relative';
    mapRef.current.style.background = 'linear-gradient(145deg, #e6f7ff 0%, #e5f2f7 40%, #daeaf1 100%)';
    
    // Add decorative terrain elements
    for (let i = 0; i < 8; i++) {
      const terrain = document.createElement('div');
      terrain.style.position = 'absolute';
      terrain.style.width = `${Math.random() * 30 + 20}%`;
      terrain.style.height = `${Math.random() * 20 + 10}%`;
      terrain.style.backgroundColor = i % 2 === 0 ? '#d3e8ef' : '#c5dfe9';
      terrain.style.borderRadius = '50%';
      terrain.style.top = `${Math.random() * 80}%`;
      terrain.style.left = `${Math.random() * 80}%`;
      terrain.style.opacity = '0.4';
      mapRef.current.appendChild(terrain);
    }
    
    // Only proceed if we have destinations
    if (destinations.length === 0) {
      const message = document.createElement('div');
      message.style.position = 'absolute';
      message.style.top = '50%';
      message.style.left = '50%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.textAlign = 'center';
      message.style.color = '#666';
      message.textContent = 'No destinations added yet';
      mapRef.current.appendChild(message);
      return;
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
    
    // Add markers for each destination
    destinations.forEach((dest, index) => {
      const top = normalize(dest.coords[0], minLat, maxLat);
      const left = normalize(dest.coords[1], minLong, maxLong);
      
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.top = `${100 - top}%`; // Invert Y-axis for map coords
      marker.style.left = `${left}%`;
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.zIndex = '20';
      
      const dot = document.createElement('div');
      dot.style.width = '16px';
      dot.style.height = '16px';
      dot.style.backgroundColor = '#0ea5e9';
      dot.style.borderRadius = '50%';
      dot.style.border = '3px solid white';
      dot.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      
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
      
      marker.appendChild(dot);
      marker.appendChild(label);
      if (mapRef.current) {
        mapRef.current.appendChild(marker);
      }
      
      // Add connecting lines between destinations
      if (index < destinations.length - 1) {
        const nextDest = destinations[index + 1];
        const nextTop = normalize(nextDest.coords[0], minLat, maxLat);
        const nextLeft = normalize(nextDest.coords[1], minLong, maxLong);
        
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.zIndex = '5';
        line.style.height = '2px';
        line.style.backgroundColor = '#0ea5e9';
        line.style.opacity = '0.6';
        
        // Calculate line position and dimensions
        const x1 = left;
        const y1 = 100 - top;
        const x2 = nextLeft;
        const y2 = 100 - nextTop;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        
        line.style.width = `${length}%`;
        line.style.top = `${y1}%`;
        line.style.left = `${x1}%`;
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        
        if (mapRef.current) {
          mapRef.current.appendChild(line);
        }
      }
    });
  };

  return (
    <div className="text-center">
      {/* Load Leaflet Javascript */}
      <Script 
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        onLoad={() => {
          setMapLoaded(true);
        }}
        onError={() => {
          console.error('Failed to load Leaflet script');
          if (mapRef.current) {
            renderFallbackMap();
          }
        }}
      />
      
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex space-x-2">
            <button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex items-center text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </button>
            <button
              onClick={discardChanges}
              disabled={isSaving}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        ) : (
          editable && (
            <button
              onClick={toggleEditMode}
              className="flex items-center text-sm text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-md shadow-sm transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Destinations
            </button>
          )
        )}
        
        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          {(isEditing ? editingDestinations : destinations).length} locations
        </div>
        
        {isEditing && (
          <button
            onClick={addDestination}
            className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      {/* Destination Editor */}
      {isEditing && editingDestIndex !== null && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Edit Destination</h4>
            <button
              onClick={() => handleDestSave(editingDestIndex)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Name
              </label>
              <input
                type="text"
                value={editingDestinations[editingDestIndex].name}
                onChange={(e) => updateDestination('name', e.target.value, editingDestIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Paris, Rome, Tokyo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates
              </label>
              <input
                type="text"
                value={editingDestinations[editingDestIndex].dates}
                onChange={(e) => updateDestination('dates', e.target.value, editingDestIndex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. May 15-18, 2025"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Search
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={geocodeInput}
                  onChange={(e) => setGeocodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for a city or place"
                />
                <button
                  onClick={searchLocation}
                  disabled={isGeocodingLoading}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeocodingLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              {/* Geocode results */}
              {geocodeResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {geocodeResults.map((result, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => selectGeocodeResult(result)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-medium text-sm">{result.display_name}</div>
                          <div className="text-xs text-gray-500">
                            {result.type}: Lat {parseFloat(result.lat).toFixed(4)}, Lon {parseFloat(result.lon).toFixed(4)}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingDestinations[editingDestIndex].coords[0]}
                    onChange={(e) => {
                      const newCoords: [number, number] = [
                        parseFloat(e.target.value) || 0,
                        editingDestinations[editingDestIndex].coords[1]
                      ];
                      updateDestination('coords', newCoords, editingDestIndex);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingDestinations[editingDestIndex].coords[1]}
                    onChange={(e) => {
                      const newCoords: [number, number] = [
                        editingDestinations[editingDestIndex].coords[0],
                        parseFloat(e.target.value) || 0
                      ];
                      updateDestination('coords', newCoords, editingDestIndex);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="h-72 md:h-96 rounded-lg shadow-inner border border-gray-100 overflow-hidden mb-4"
        style={{ background: '#f1f5f9' }}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {(isEditing ? editingDestinations : destinations).map((d, i) => (
          <div
            key={d.name + i}
            className="relative"
          >
            <button
              onClick={() => setSelectedDest(d.name)}
              className={`flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors text-left w-full ${
                selectedDest === d.name ? 'bg-blue-50 border border-blue-200' : 'border border-gray-100'
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">{d.name}</p>
                <p className="text-xs text-gray-500">{d.dates}</p>
              </div>
            </button>
            
            {isEditing && (
              <div className="absolute right-2 top-2 flex space-x-1">
                {editingDestIndex !== i && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDestEdit(i);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                      aria-label="Edit destination"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDestination(i);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      aria-label="Delete destination"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        
        {(isEditing ? editingDestinations : destinations).length === 0 && (
          <div className="md:col-span-3 text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No destinations added yet.</p>
            {isEditing && (
              <button
                onClick={addDestination}
                className="mt-3 flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors shadow-sm mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Destination
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        Click on a destination to highlight it on the map
      </div>
    </div>
  )
}

// Add TypeScript declaration for Leaflet
declare global {
  interface Window {
    L: any;
  }
}