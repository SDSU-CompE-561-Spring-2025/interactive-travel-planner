"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { HexColorPicker } from "react-colorful";

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
  image_url?: string | null;
  color?: string | null;
}

interface Collaborator {
  id: number;
  email: string;
  username: string;
}

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedItinerary, setSelectedItinerary] = React.useState<Trip["itineraries"][0] | null>(null);
  const { id } = React.use(params);
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const [collabLoading, setCollabLoading] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteError, setInviteError] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Collaborator[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchError, setSearchError] = React.useState("");

  const fetchCollaborators = React.useCallback(async () => {
    setCollabLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get<Collaborator[]>(`http://localhost:8000/trips/${id}/collaborators/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollaborators(res.data);
    } catch (e) {
      setCollaborators([]);
    } finally {
      setCollabLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.post(
        `http://localhost:8000/trips/${id}/collaborators/`,
        new URLSearchParams({ collaborator_email: inviteEmail }),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInviteEmail("");
      fetchCollaborators();
      toast({ title: "Success!", description: "Collaborator invited." });
    } catch (error: any) {
      setInviteError(error?.response?.data?.detail || "Failed to invite collaborator.");
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.delete(
        `http://localhost:8000/trips/${id}/collaborators/${collaboratorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCollaborators();
      toast({ title: "Success!", description: "Collaborator removed." });
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.detail || "Failed to remove collaborator.", variant: "destructive" });
    }
  };

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

  // Modal component for itinerary details
  function ItineraryModal({ itinerary, onClose }: { itinerary: Trip["itineraries"][0], onClose: () => void }) {
    if (!itinerary) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
          <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>✕</button>
          <h2 className="text-xl font-bold mb-2">{itinerary.name}</h2>
          <p className="mb-2">{itinerary.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(itinerary.start_date).toLocaleString()} - {new Date(itinerary.end_date).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  React.useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    const timeout = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get<Collaborator[]>(
          `http://localhost:8000/trips/users/search?query=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(res.data);
      } catch (e) {
        setSearchError("Failed to search users.");
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleAddCollaborator = async (user: Collaborator) => {
    setInviteError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      await axios.post(
        `http://localhost:8000/trips/${id}/collaborators/`,
        new URLSearchParams({ collaborator_email: user.email }),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchQuery("");
      setSearchResults([]);
      fetchCollaborators();
      toast({ title: "Success!", description: "Collaborator added." });
    } catch (error: any) {
      setInviteError(error?.response?.data?.detail || "Failed to add collaborator.");
    }
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
      {/* Trip image/color block at the top */}
      <div className="mb-8">
        {trip.image_url ? (
          <img
            src={`http://localhost:8000${trip.image_url}`}
            alt="Trip"
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        ) : (
          <div
            className="w-full h-64 rounded-lg shadow"
            style={{ background: trip.color || "#aabbcc" }}
          />
        )}
      </div>
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
              <div key={itinerary.id} onClick={() => setSelectedItinerary(itinerary)}>
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
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedItinerary && (
        <ItineraryModal
          itinerary={selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}
      <div className="mb-8">
        {/* Collaborators UI */}
        <h2 className="text-xl font-bold mb-2">Collaborators</h2>
        {collabLoading ? (
          <div>Loading collaborators...</div>
        ) : (
          <ul className="mb-2">
            {collaborators.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-1">
                <span>{c.username} ({c.email})</span>
                <Button size="sm" variant="destructive" onClick={() => handleRemoveCollaborator(c.id)}>
                  Remove
                </Button>
              </li>
            ))}
            {collaborators.length === 0 && <li className="text-gray-500">No collaborators yet.</li>}
          </ul>
        )}
        {/* User search for adding collaborators */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search users by username or email"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          {searchLoading && <div className="text-sm text-gray-500">Searching...</div>}
          {searchError && <div className="text-red-500 text-sm">{searchError}</div>}
          {searchResults.length > 0 && (
            <ul className="border rounded bg-white shadow mt-1 max-h-40 overflow-y-auto">
              {searchResults.map(user => (
                <li key={user.id} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <span>{user.username} ({user.email})</span>
                  <Button size="sm" onClick={() => handleAddCollaborator(user)}>
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {inviteError && <div className="text-red-500 text-sm mt-1">{inviteError}</div>}
      </div>
    </div>
  );
}
