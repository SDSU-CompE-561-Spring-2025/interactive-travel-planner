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
import { HexColorPicker } from "react-colorful";

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
  image_url?: string;
  color?: string;
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
  const [editTrip, setEditTrip] = useState<Trip | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editColor, setEditColor] = useState("#aabbcc");
  const [editError, setEditError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

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

  const openEditModal = (trip: Trip) => {
    setEditTrip(trip);
    setEditImage(null);
    setEditColor(trip.color || "#aabbcc");
    setEditError("");
    setShowEditModal(true);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setEditError("Image must be JPEG or PNG");
        setEditImage(null);
        return;
      }
      setEditError("");
      setEditImage(file);
    } else {
      setEditImage(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    if (!editTrip) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      if (!editImage && !editColor) {
        setEditError("Please select a color or upload an image.");
        return;
      }
      const form = new FormData();
      form.append("trip_id", String(editTrip.id));
      form.append("name", editTrip.name || "");
      form.append("description", editTrip.description || "");
      form.append("start_date", editTrip.start_date || "");
      form.append("end_date", editTrip.end_date || "");
      form.append("itineraries", JSON.stringify(editTrip.itineraries?.map(i => i.id) || []));
      if (editImage) {
        form.append("image", editImage);
      } else if (editColor) {
        form.append("color", editColor);
      }
      await axios.put(
        "http://localhost:8000/trips/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({ title: "Success!", description: "Trip updated." });
      setShowEditModal(false);
      setEditImage(null);
      setEditError("");
      // Refetch trips
      setIsLoading(true);
      const response = await axios.get<Trip[]>("http://localhost:8000/trips/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(response.data);
      setIsLoading(false);
    } catch (error: any) {
      setEditError(error?.response?.data?.detail || "Failed to update trip.");
    }
  };

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
              <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer flex flex-col${trip.is_owner ? '' : ' border-yellow-400 border-2 bg-yellow-50'}`}>
                <div className="relative">
                  {trip.image_url ? (
                    <img
                      src={`http://localhost:8000${trip.image_url}`}
                      alt="Trip"
                      className="w-full h-40 object-cover rounded-t-lg shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-full h-40 rounded-t-lg"
                      style={{ background: trip.color || '#f5f5dc' }}
                    />
                  )}
                  {trip.is_owner && (
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-200"
                      onClick={e => { e.preventDefault(); openEditModal(trip); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                    </button>
                  )}
                </div>
                <CardHeader className="flex-1">
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
      {/* Edit Modal */}
      {showEditModal && editTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400" onClick={() => setShowEditModal(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4">Edit Trip Image/Color</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Trip Image (JPEG/PNG, optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleEditImageChange}
                />
                {editError && <div className="text-red-500 text-sm mt-1">{editError}</div>}
              </div>
              {!editImage && (
                <div>
                  <label className="block mb-1">Trip Color (if no image)</label>
                  <div className="flex items-center space-x-4">
                    <HexColorPicker color={editColor} onChange={setEditColor} />
                    <div
                      className="w-10 h-10 rounded-full border"
                      style={{ background: editColor }}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const { user } = useContext(AuthContext);
  return user ? <TripsList /> : <LandingPage />;
}
