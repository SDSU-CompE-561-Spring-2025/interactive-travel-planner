"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import MapComponent from "@/components/MapComponent";
import { ItineraryMap } from "@/components/ItineraryMap";
import { ItineraryTimeline } from "@/components/ItineraryTimeline";
import Map, { Map as NamedMap } from "@/components/Map";
import { DayView } from "@/components/DayView";
import { Button } from "@/components/ui/button";
import { Calendar, Globe } from "lucide-react";
import Logo from "@/components/Logo";

interface Trip {
  id: number;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  color?: string;
}

// Replacing dummy geocoding with a call to Nominatim (worldwide geocoding)
async function geocodeLocation(location: string): Promise<[number, number] | null> {
  if (!location) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (e) { console.error("Geocoding error:", e); }
  return null;
}

export default function DashboardMapPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const response = await axios.get<Trip[]>("/trips/");
        setTrips(response.data);
        // Geocode all trip locations
        const geocoded = await Promise.all(
          response.data.map(async (trip, idx) => {
            const coords = await geocodeLocation(trip.location);
            return coords
              ? {
                  id: trip.id.toString(),
                  name: trip.name,
                  location: coords,
                  startDate: trip.start_date ? new Date(trip.start_date) : undefined,
                  endDate: trip.end_date ? new Date(trip.end_date) : undefined,
                  comments: trip.location,
                  color: trip.color || "#f3a034",
                }
              : null;
          })
        );
        let filtered = geocoded.filter(Boolean);
        // Remove fallback: do not add NYC if no destinations
        setDestinations(filtered);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [router]);

  // Default center (NYC)
  const center: [number, number] = [40.7128, -74.006];

  return (
    <ProtectedRoute>
      {/* Fixed dashboard header bar (copied from trips dashboard) */}
      <div className="fixed top-0 left-0 w-full z-[999] bg-background border-b border-border flex items-center px-8 py-3" style={{ minHeight: '60px' }}>
        <Logo />
        <div className="flex gap-6 ml-8">
          <Button
            variant="ghost"
            className="text-[#f3a034] font-semibold flex items-center gap-2 px-4 py-2"
            onClick={() => router.push('/dashboard')}
          >
            My Trips
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 font-semibold flex items-center gap-2 px-4 py-2"
            onClick={() => router.push('/planner/startFmyF')}
          >
            Create Trip
          </Button>
        </div>
      </div>
      <div className="min-h-screen bg-[#fff8f0] pt-[72px]"> {/* Add top padding to offset fixed bar */}
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 py-4 bg-white mb-8">
          <Button
            variant="ghost"
            className="text-[#f3a034] font-semibold flex items-center gap-2 px-6 py-2"
            onClick={() => router.push('/dashboard')}
          >
            <Calendar className="h-5 w-5" />
            My Trips
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 font-semibold flex items-center gap-2 px-6 py-2"
            onClick={() => router.push('/dashboard/map')}
          >
            <Globe className="h-5 w-5" />
            Travel Map
          </Button>
        </div>
        <div className="flex-1 w-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3a034]"></div>
            </div>
          ) : (
            <div className="w-full flex justify-center gap-4 pt-8">
              <div style={{ height: "500px", width: "100%", maxWidth: 800 }}>
                <MapComponent
                  destinations={destinations}
                  center={center}
                  zoom={3}
                  onSelectDestination={() => {}}
                  onMapMove={() => {}}
                />
              </div>
              <div className="w-full max-w-xs">
                <ItineraryTimeline
                  locations={trips
                    .filter(trip => trip.start_date && trip.end_date)
                    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                    .map(trip => ({
                      id: trip.id,
                      name: trip.name,
                      coordinates: { lat: 0, lng: 0 }, // Not used
                      date: trip.start_date,
                      start_date: trip.start_date,
                      end_date: trip.end_date,
                    }))
                  }
                  transportation={[]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
