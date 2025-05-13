"use client";

import { useContext, useState, useEffect } from "react";
import AuthContext from "./context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { TravelersImage } from "@/components/TravelersImage";
import { HowItWorks } from "@/components/how-it-works";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Itinerary {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface Trip {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  itineraries: Itinerary[];
  is_owner?: boolean;
  collaborators?: { id: number; username: string; email: string }[];
  owner_name?: string;
  owner_email?: string;
}

const LandingPage = () => {
  return (
      <div className="container max-w-7xl py-10">
        <HeroSection />
        <TravelersImage />
        <HowItWorks />
      </div>
    );
  };

const TripsList = () => {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get<Trip[]>("http://localhost:8000/trips/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrips(response.data);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
        toast({
          title: "Error",
          description: "Failed to load trips. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link href="/new-trip">
          <Button>Create New Trip</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Trips Yet</CardTitle>
              <CardDescription>Start planning your first adventure!</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/new-trip">
                <Button className="w-full">Create Your First Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          trips.map((trip) => (
            <Link href={`/trips/${trip.id}`} key={trip.id}>
              <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${trip.is_owner ? '' : 'border-yellow-400 border-2 bg-yellow-50'}`}>
                <CardHeader>
                  <CardTitle>{trip.name}</CardTitle>
                  <CardDescription>{trip.description}</CardDescription>
                  {!trip.is_owner && (
                    <>
                      <span className="text-xs text-yellow-700 font-semibold bg-yellow-200 rounded px-2 py-1 ml-2">Collaborator</span>
                      <div className="text-xs text-gray-700 mt-1">Owner: {trip.owner_name}</div>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {trip.itineraries.length} Itinerary
                        {trip.itineraries.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {trip.itineraries.length === 0 && (
                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          Create Itinerary
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useContext(AuthContext);
  return user ? <TripsList /> : <LandingPage />;
}
