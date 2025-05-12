"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface Trip {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  itineraries: Array<{
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
  }>;
}

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { id } = React.use(params);

  React.useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get<Trip>(`http://localhost:8000/trips/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrip(response.data);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
        toast({
          title: "Error",
          description: "Failed to fetch trip details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-7xl py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container max-w-7xl py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Trip not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{trip.name}</h1>
          <p className="text-gray-500 mt-2">{trip.description}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Link href={`/trips/${trip.id}/new-itinerary`}>
            <Button>Create Itinerary</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Itineraries</h2>
        {trip.itineraries.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Itineraries Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/trips/${trip.id}/new-itinerary`}>
                <Button className="w-full">Create Itinerary</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trip.itineraries.map((itinerary) => (
              <Link href={`/itineraries/${itinerary.id}`} key={itinerary.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{itinerary.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
