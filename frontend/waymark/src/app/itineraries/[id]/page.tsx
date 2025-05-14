"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, Plus, ArrowLeft, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { ItineraryMap } from "@/components/ItineraryMap";
import { ItineraryTimeline } from "@/components/ItineraryTimeline";
import { DayView } from "@/components/DayView";

// Dynamically import the map component with no SSR
const Map = dynamic(() => import('@/components/ItineraryMap').then(mod => mod.ItineraryMap), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-lg bg-muted animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

interface Location {
  id: number;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  startDate: string;
  endDate: string;
}

interface Transportation {
  id: number;
  type: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  provider: string;
}

interface Activity {
  id: number;
  destinationId: number;
  name: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  notes?: string;
  category: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Itinerary {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  locations: Array<{
    id: number;
    name: string;
    coordinates: { lat: number; lng: number };
    date: string;
    start_date: string;
    end_date: string;
  }>;
  transportation: Array<{
    id: number;
    type: string;
    from_location: string;
    to_location: string;
    departure_date: string;
    departure_time: string;
    arrival_date: string;
    arrival_time: string;
    provider: string;
  }>;
  activities: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    notes: string | null;
    category: string;
    coordinates: { lat: number; lng: number } | null;
    location_id: number | null;
  }>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [itinerary, setItinerary] = React.useState<Itinerary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  // Unwrap the params using React.use()
  const { id } = React.use(params);

  React.useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get<Itinerary>(`http://localhost:8000/api/itineraries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItinerary(response.data);
        // Set initial selected date to the first day of the itinerary
        if (response.data.start_date) {
          setSelectedDate(response.data.start_date);
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        toast({
          title: "Error",
          description: "Failed to load itinerary details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl py-10">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container max-w-7xl py-10">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Itinerary Not Found</h2>
              <p className="text-gray-600 mb-6">The itinerary you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => router.back()} variant="outline" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => router.push('/trips')}>
                View All Trips
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Group activities by date
  const activitiesByDate = itinerary.activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof itinerary.activities>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <span className="text-sm text-gray-500">Trip Details</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{itinerary.name}</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">{itinerary.description}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Trip Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Duration</h3>
              </div>
              <p className="text-gray-600">
                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Destinations</h3>
              </div>
              <p className="text-gray-600">
                {itinerary.locations.length} locations planned
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Activities</h3>
              </div>
              <p className="text-gray-600">
                {itinerary.activities.length} activities scheduled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-100">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-gray-100">
                Map
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-gray-100">
                Activities
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Itinerary Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ItineraryTimeline
                  locations={itinerary.locations}
                  transportation={itinerary.transportation}
                  onLocationClick={(location) => {
                    console.log('Location clicked:', location);
                  }}
                  onTransportationClick={(transportation) => {
                    console.log('Transportation clicked:', transportation);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Itinerary Map</CardTitle>
              </CardHeader>
              <CardContent>
                <Map
                  locations={itinerary.locations}
                  className="h-[500px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.entries(activitiesByDate).map(([date, activities]) => (
                    <div key={date}>
                      <h3 className="text-lg font-semibold mb-4">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <Card key={activity.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {activity.time} ({activity.duration})
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{activity.location}</span>
                                    </div>
                                    {activity.notes && (
                                      <p className="text-sm">{activity.notes}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                                    {activity.category}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
