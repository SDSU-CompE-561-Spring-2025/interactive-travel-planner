"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Calendar, Clock, MessageSquare, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Define the destination type
type Destination = {
  id: string;
  name: string;
  location: [number, number];
  startDate: Date | undefined;
  endDate: Date | undefined;
  comments: string;
  color: string;
};

// Color palette - softer, more modern colors
const colorPalette = [
  "#66D1C8", // Teal
  "#FFD166", // Yellow
  "#FF9F74", // Coral
  "#DCB0F2", // Lavender
  "#FF9AA2", // Pink
  "#9EB9F3", // Blue
  "#FEBB81", // Orange
  "#B8E986", // Green
  "#8DE0A4", // Mint
  "#B497E7", // Purple
  "#D3D3D3", // Light Gray
];

const MapWithNoSSR = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function TravelPlanner({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([45, 5]);
  const [zoom, setZoom] = useState(4);
  const [newDestinationName, setNewDestinationName] = useState("");
  const [newDestinationDate, setNewDestinationDate] = useState<Date | undefined>(undefined);
  const [newDestinationEndDate, setNewDestinationEndDate] = useState<Date | undefined>(undefined);
  const [newDestinationColor, setNewDestinationColor] = useState(colorPalette[0]);
  const [newDestinationComments, setNewDestinationComments] = useState("");
  const [isAddSectionExpanded, setIsAddSectionExpanded] = useState(false);
  const [tripName, setTripName] = useState("");
  const [tripDescription, setTripDescription] = useState("");
  const [tripId, setTripId] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setTripId(id);
      await fetchDestinations(id);
    })();
    // eslint-disable-next-line
  }, [params]);

  // Fetch trip and destinations from backend
  const fetchDestinations = async (id: string) => {
      try {
        const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const res = await fetch(`http://localhost:8000/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Trip not found");
      const trip = await res.json();
      setTripName(trip.name);
      setTripDescription(trip.description);
      // Convert backend destinations to local format
      const dests: Destination[] = (trip.destinations || []).map((d: any) => ({
        id: d.id?.toString() ?? Math.random().toString(),
        name: d.name,
        location: d.coordinates ? [d.coordinates.lat, d.coordinates.lng] : [0, 0],
        startDate: d.start_date ? new Date(d.start_date) : undefined,
        endDate: d.end_date ? new Date(d.end_date) : undefined,
        comments: d.comments || "",
        color: d.color || colorPalette[0],
      }));
      setDestinations(dests);
      if (dests.length > 0) {
        setMapCenter(dests[0].location);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to load trip." });
    }
  };

  // Geocode a place name to [lat, lng] using Nominatim
  const geocodeLocation = async (place: string): Promise<[number, number] | null> => {
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Add this function to handle location search
  const handleLocationSearch = async () => {
    if (!newDestinationName.trim()) return
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=en&q=${encodeURIComponent(newDestinationName)}`
      )
      if (!res.ok) throw new Error('Location search failed')
      const data = await res.json()
      if (data && Array.isArray(data)) {
        setSearchResults(
          data.map((item: any) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }))
        )
      } else {
        setSearchResults([])
        toast({ title: "Error", description: "No locations found" })
      }
    } catch (error) {
      console.error("Error fetching location data:", error)
      toast({ title: "Error", description: "Location search failed" })
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Update the addNewDestination function
  const addNewDestination = async () => {
    if (!selectedLocation || !tripId) {
      console.log("Missing required data:", { selectedLocation, tripId });
      return;
    }
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")
      
      // First verify the trip exists
      const tripRes = await fetch(`http://localhost:8000/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
          },
        });
      
      if (!tripRes.ok) {
        const tripError = await tripRes.text();
        console.error("Trip verification failed:", tripError);
        throw new Error("Trip not found or you don't have access to it");
      }
      
      const body = {
        name: selectedLocation.name.split(',')[0], // Use just the first part of the location name
        coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        date: null, // Explicitly set date to null since it's optional
        start_date: newDestinationDate ? newDestinationDate.toISOString() : null,
        end_date: newDestinationEndDate ? newDestinationEndDate.toISOString() : null,
        color: newDestinationColor,
        comments: newDestinationComments,
        trip_id: parseInt(tripId) // Ensure trip_id is a number
      }

      console.log("Sending request to create destination:", {
        url: "http://localhost:8000/destinations",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      // Create the destination
      const res = await fetch(`http://localhost:8000/destinations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      console.log("Response status:", res.status);
      const responseText = await res.text();
      console.log("Response body:", responseText);

      if (!res.ok) {
        let errorDetail;
        try {
          const errorData = JSON.parse(responseText);
          errorDetail = errorData.detail || "Failed to add destination";
        } catch (e) {
          errorDetail = responseText || "Failed to add destination";
        }
        throw new Error(errorDetail);
      }

      await fetchDestinations(tripId)
      resetNewDestinationForm()
      setIsAddSectionExpanded(false)
      setSelectedLocation(null)
      setSearchResults([])
      toast({ title: "Success", description: "Destination added." })
    } catch (e: any) {
      console.error("Error adding destination:", e)
        toast({
          title: "Error",
        description: e.message || "Failed to add destination.",
        variant: "destructive"
      })
    }
  }

  // Update destination (PUT to backend)
  const updateDestination = async (updated: Destination) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const body = {
        name: updated.name,
        coordinates: { lat: updated.location[0], lng: updated.location[1] },
        start_date: updated.startDate ? updated.startDate.toISOString() : null,
        end_date: updated.endDate ? updated.endDate.toISOString() : null,
        color: updated.color,
        comments: updated.comments,
      };
      const res = await fetch(`http://localhost:8000/destinations/${updated.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update destination");
      await fetchDestinations(tripId);
      setSelectedDestination(updated);
      toast({ title: "Success", description: "Destination updated." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to update destination." });
    }
  };

  // Delete destination (DELETE to backend)
  const deleteDestination = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const res = await fetch(`http://localhost:8000/destinations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete destination");
      await fetchDestinations(tripId);
      setSelectedDestination(null);
      toast({ title: "Success", description: "Destination deleted." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to delete destination." });
    }
  };

  // Update the resetNewDestinationForm function
  const resetNewDestinationForm = () => {
    setNewDestinationName("")
    setNewDestinationDate(undefined)
    setNewDestinationEndDate(undefined)
    setNewDestinationComments("")
    setNewDestinationColor(colorPalette[Math.floor(Math.random() * colorPalette.length)])
    setSelectedLocation(null)
    setSearchResults([])
  }

  const sortedDestinations = [...destinations].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.getTime() - b.startDate.getTime();
  });

    return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-6 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800">{tripName || "Travel Planner"}</h1>
            <p className="text-gray-500 mt-1">{tripDescription || "Plan and organize your dream destinations"}</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex flex-col items-center p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="w-full max-w-6xl">
            {/* Map container */}
            <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg mb-6 bg-white">
              <MapWithNoSSR
                destinations={sortedDestinations}
                center={mapCenter}
                zoom={zoom}
                onSelectDestination={setSelectedDestination}
                onMapMove={(center, z) => {
                  setMapCenter(center);
                  setZoom(z);
                }}
              />
            </div>

            {/* Destination tiles */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Your Destinations</h2>

                <Button
                  className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-[#66D1C8] to-[#9EB9F3] hover:opacity-90 shadow-md transition-all"
                  onClick={() => setIsAddSectionExpanded(!isAddSectionExpanded)}
                >
                  <Plus className="h-6 w-6 text-white" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-5 justify-items-center mx-auto">
                {sortedDestinations.map((dest, index) => (
                  <Card
                    key={dest.id}
                    className="overflow-hidden border-2 border-gray-100 transition-all hover:shadow-lg cursor-pointer group animate-fadeIn rounded-xl w-full max-w-[300px]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => setSelectedDestination(dest)}
                  >
                    <div
                      className="h-16 flex items-center justify-between px-4 relative"
                      style={{ backgroundColor: dest.color }}
                    >
                      <div className="flex items-center">
                        <div className="bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm shadow-sm">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-white text-lg">{dest.name}</h3>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDestination(dest);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[400px] p-0 overflow-hidden shadow-xl border-none"
                            align="center"
                            side="right"
                            sideOffset={15}
                          >
                            <div className="relative">
                              {/* Left accent bar */}
                              <div
                                className="absolute left-0 top-0 bottom-0 w-3"
                                style={{ backgroundColor: dest.color }}
                              ></div>

                              <div className="pl-6 pr-6 pt-8 pb-6">
                                <h2 className="text-2xl font-semibold text-center mb-6">Edit Destination</h2>

                                <div className="space-y-5">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <Input
                                      value={dest.name}
                                      onChange={(e) => updateDestination({ ...dest, name: e.target.value })}
                                      className="border-gray-300 focus:ring-2 focus:ring-[#9EB9F3] focus:border-transparent"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-base font-medium text-gray-800 mb-2">Start</label>
                                      <div className="relative">
                                        <Input
                                          type="text"
                                          placeholder="mm/dd/yyyy"
                                          value={dest.startDate ? format(dest.startDate, "MM/dd/yyyy") : ""}
                                          readOnly
                                          className="border-gray-200 pr-10 cursor-pointer"
                                        />
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            >
                                              <Calendar className="h-5 w-5 text-gray-500" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="p-0 w-auto" align="start">
                                            <CalendarComponent
                                              mode="single"
                                              selected={dest.startDate}
                                              onSelect={(date) => updateDestination({ ...dest, startDate: date })}
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
        </div>
      </div>

                                    <div>
                                      <label className="block text-base font-medium text-gray-800 mb-2">End</label>
                                      <div className="relative">
                                        <Input
                                          type="text"
                                          placeholder="mm/dd/yyyy"
                                          value={dest.endDate ? format(dest.endDate, "MM/dd/yyyy") : ""}
                                          readOnly
                                          className="border-gray-200 pr-10 cursor-pointer"
                                        />
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            >
                                              <Calendar className="h-5 w-5 text-gray-500" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="p-0 w-auto" align="start">
                                            <CalendarComponent
                                              mode="single"
                                              selected={dest.endDate}
                                              onSelect={(date) => updateDestination({ ...dest, endDate: date })}
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
        </div>
      </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                                    <Textarea
                                      value={dest.comments}
                                      onChange={(e) => updateDestination({ ...dest, comments: e.target.value })}
                                      rows={3}
                                      className="border-gray-300 focus:ring-2 focus:ring-[#9EB9F3] focus:border-transparent"
                                    />
                                  </div>

        <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tile Color</label>
                                    <div className="flex flex-wrap gap-3">
                                      {colorPalette.map((color) => (
                                        <button
                                          key={color}
                                          className={`w-10 h-10 rounded-full transition-all ${
                                            dest.color === color ? "ring-2 ring-offset-2 ring-gray-500 scale-110" : ""
                                          }`}
                                          style={{ backgroundColor: color }}
                                          onClick={() => updateDestination({ ...dest, color })}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex justify-between items-center gap-3 mt-8">
                                    <Button
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteDestination(dest.id);
                                      }}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>

                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                      className="rounded-full px-6 py-5 text-white"
                                      style={{ backgroundColor: dest.color }}
                                    >
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              </div>
        </div>
                          </PopoverContent>
                        </Popover>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDestination(dest.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

                    <CardContent className="p-4">
                      <div className="text-gray-700">
                        {dest.startDate && dest.endDate ? (
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              {format(dest.startDate, "MMM d")} - {format(dest.endDate, "MMM d, yyyy")}
              </span>
                          </div>
                        ) : (
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">No dates set</span>
                          </div>
                        )}

                        {dest.comments && (
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                            <span className="line-clamp-2 text-sm">{dest.comments}</span>
                          </div>
                        )}
            </div>
          </CardContent>
        </Card>
                ))}
              </div>
            </div>
      </div>
        </main>

        {/* Add Destination Slide Down Section */}
        {isAddSectionExpanded && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
            width: "100%",
            maxWidth: "36rem",
            margin: "0 auto 2rem auto",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsAddSectionExpanded(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                color: "#6B7280",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {/* Title */}
            <h3 style={{
              fontSize: "1.125rem",
              fontWeight: 500,
              textAlign: "center",
              color: "#1F2937",
              marginBottom: "1.5rem"
            }}>
              Add Destination
            </h3>
            {/* Location Field */}
            <div style={{ marginBottom: "1.5rem", width: "100%" }}>
              <label style={{ 
                display: "block", 
                fontSize: "0.875rem", 
                color: "#4B5563", 
                marginBottom: "0.5rem" 
              }}>
                Location
              </label>
              <div style={{ position: "relative" }}>
                <svg style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  zIndex: 10
                }} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search place..."
                  value={newDestinationName}
                  onChange={e => setNewDestinationName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLocationSearch()}
                  style={{
                    width: "100%",
                    paddingLeft: "2.5rem",
                    paddingRight: "1rem",
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    fontSize: "1rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.5rem",
                    outline: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  onClick={handleLocationSearch}
                  disabled={isSearching}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6B7280",
                    cursor: "pointer",
                    padding: "0.25rem"
                  }}
                >
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {searchResults.length > 0 && (
                <ul style={{
                  marginTop: "0.25rem",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  maxHeight: "10rem",
                  overflowY: "auto",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  zIndex: 50,
                  position: "relative"
                }}>
                  {searchResults.map((result, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedLocation(result)
                        setNewDestinationName(result.name.split(',')[0])
                        setSearchResults([])
                      }}
                      style={{
                        padding: "0.75rem",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        borderBottom: i < searchResults.length - 1 ? "1px solid #E5E7EB" : "none"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {result.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Color Picker */}
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <span style={{
                display: "block",
                fontSize: "0.875rem",
                color: "#4B5563",
                marginBottom: "0.5rem"
              }}>
                Card Color
                        </span>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                flexWrap: "wrap"
              }}>
                {colorPalette.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewDestinationColor(c)}
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "9999px",
                      backgroundColor: c,
                      border: newDestinationColor === c ? "2px solid #9CA3AF" : "none",
                      transform: newDestinationColor === c ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.2s",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Date Range */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "2rem"
            }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  color: "#4B5563",
                  marginBottom: "0.25rem"
                }}>
                  Start Date
                </label>
                <div style={{ position: "relative" }}>
                  <svg style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF"
                  }} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  <input
                    type="date"
                    value={newDestinationDate ? newDestinationDate.toISOString().split('T')[0] : ''}
                    onChange={e => setNewDestinationDate(new Date(e.target.value))}
                    style={{
                      width: "100%",
                      paddingLeft: "2.5rem",
                      paddingRight: "0.75rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      fontSize: "0.875rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "0.5rem",
                      outline: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  color: "#4B5563",
                  marginBottom: "0.25rem"
                }}>
                  End Date
                </label>
                <div style={{ position: "relative" }}>
                  <svg style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF"
                  }} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  <input
                    type="date"
                    value={newDestinationEndDate ? newDestinationEndDate.toISOString().split('T')[0] : ''}
                    onChange={e => setNewDestinationEndDate(new Date(e.target.value))}
                    style={{
                      width: "100%",
                      paddingLeft: "2.5rem",
                      paddingRight: "0.75rem",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      fontSize: "0.875rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "0.5rem",
                      outline: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                      </div>
                    </div>
            {/* Comments - Optional */}
            <div style={{ marginBottom: "1.5rem", width: "100%" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                color: "#4B5563",
                marginBottom: "0.5rem"
              }}>
                Comments
              </label>
              <textarea
                placeholder="Add notes about this destination"
                value={newDestinationComments}
                onChange={e => setNewDestinationComments(e.target.value)}
                rows={2}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>
            {/* Action Buttons */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem"
            }}>
              <button
                onClick={() => {
                  resetNewDestinationForm();
                  setIsAddSectionExpanded(false);
                }}
                style={{
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: "0.5rem",
                  backgroundColor: "#E5E7EB",
                  color: "#374151",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = "#D1D5DB"}
                onMouseOut={e => e.currentTarget.style.backgroundColor = "#E5E7EB"}
              >
                Cancel
              </button>
              <button
                onClick={addNewDestination}
                disabled={!selectedLocation || !newDestinationName || isSearching}
                style={{
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: "0.5rem",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  cursor: !selectedLocation || !newDestinationName || isSearching ? "not-allowed" : "pointer",
                  opacity: !selectedLocation || !newDestinationName || isSearching ? 0.5 : 1,
                  transition: "background-color 0.2s"
                }}
                onMouseOver={e => {
                  if (selectedLocation && newDestinationName && !isSearching) {
                    e.currentTarget.style.backgroundColor = "#1D4ED8"
                  }
                }}
                onMouseOut={e => {
                  if (selectedLocation && newDestinationName && !isSearching) {
                    e.currentTarget.style.backgroundColor = "#2563EB"
                  }
                }}
              >
                {isSearching ? "Searching..." : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
