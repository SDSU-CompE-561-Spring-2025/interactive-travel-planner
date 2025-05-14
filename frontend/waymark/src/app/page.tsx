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
import { Calendar, MapPin, Clock, X, Handshake } from "lucide-react";
import { HexColorPicker } from "react-colorful";

interface Itinerary {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserStats {
  trips: number;
  countries: number;
  friends: number;
}

interface SocialLink {
  label: string;
  url: string;
}

interface Trip {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  itineraries: Itinerary[];
  is_owner?: boolean;
  collaborators?: User[];
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

// Edit Profile Modal Component
function EditProfileModal({ profile, setProfile, onClose, toast }: any) {
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [social, setSocial] = useState<SocialLink[]>(profile.social || []);
  const [newSocial, setNewSocial] = useState({ label: "", url: "" });
  const [loading, setLoading] = useState(false);

  const handleAddSocial = () => {
    if (newSocial.label && newSocial.url) {
      setSocial([...social, newSocial]);
      setNewSocial({ label: "", url: "" });
    }
  };
  const handleRemoveSocial = (label: string) => {
    setSocial(social.filter(s => s.label !== label));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const payload = {
        bio,
        location,
        social,
      };
      const response = await axios.patch("http://localhost:8000/users/me/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data as { bio: string; location: string; social: SocialLink[] };
      setProfile({
        bio: data.bio,
        location: data.location,
        social: data.social || [],
      });
      toast({ title: "Profile updated!" });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}><X /></button>
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={location}
              onChange={e => setLocation(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Social Links</label>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Label (e.g. Instagram)"
                value={newSocial.label}
                onChange={e => setNewSocial({ ...newSocial, label: e.target.value })}
                maxLength={20}
              />
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="URL"
                value={newSocial.url}
                onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                maxLength={100}
              />
              <Button type="button" onClick={handleAddSocial} disabled={!newSocial.label || !newSocial.url}>Add</Button>
            </div>
            <ul className="space-y-1">
              {social.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-medium">{s.label}:</span>
                  <a href={s.url} className="text-blue-600 hover:underline text-sm" target="_blank" rel="noopener noreferrer">{s.url}</a>
                  <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveSocial(s.label)}>Remove</Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useContext(AuthContext);
  if (!user) return <LandingPage />;

  // Fetch user stats
  const [userStats, setUserStats] = useState<UserStats>({
    trips: 0,
    countries: 0,
    friends: 0
  });
  const [profile, setProfile] = useState({
    bio: user.bio || "",
    location: user.location || "",
    social: user.social || []
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get<UserStats>("http://localhost:8000/users/me/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserStats(response.data);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };
    fetchUserStats();
  }, []);

  // Fetch user profile info on mount (for bio/location/social)
  useEffect(() => {
    setProfile({
      bio: user.bio || "",
      location: user.location || "",
      social: user.social || []
    });
  }, [user]);

  // Tab state
  const [activeTab, setActiveTab] = useState<'trips' | 'friends' | 'map'>('trips');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <div className="flex max-w-7xl mx-auto py-8 gap-8">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              {/* Placeholder avatar */}
              <span className="text-4xl text-gray-400">👤</span>
            </div>
            <div className="text-xl font-bold mb-1">{user.username}</div>
            <div className="text-gray-500 text-sm flex items-center gap-1 mb-2">
              <MapPin className="w-4 h-4" /> {profile.location || "No location set"}
            </div>
            <div className="text-center text-gray-600 text-sm mb-4">{profile.bio || "No bio yet"}</div>
            <Button variant="outline" className="w-full" onClick={() => setShowEditProfile(true)}>Edit Profile</Button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold text-lg mb-4">Stats</div>
            <div className="flex justify-between text-center">
              <div><div className="text-2xl font-bold">{userStats.trips}</div><div className="text-sm text-gray-500">Trips</div></div>
              <div><div className="text-2xl font-bold">{userStats.countries}</div><div className="text-sm text-gray-500">Countries</div></div>
              <div><div className="text-2xl font-bold">{userStats.friends}</div><div className="text-sm text-gray-500">Friends</div></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold text-lg mb-4">Social</div>
            <div className="flex flex-col gap-2">
              {profile.social && Array.isArray(profile.social) && profile.social.length > 0 ? (
                profile.social.map((s: SocialLink) => (
                  <a key={s.label} href={s.url} className="text-blue-600 hover:underline text-sm">{s.label}</a>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No social links added</div>
              )}
            </div>
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab('trips')} className={`flex-1 py-2 rounded bg-white shadow font-semibold flex items-center justify-center gap-2 border border-gray-200 ${activeTab === 'trips' ? 'ring-2 ring-primary' : ''}`}>
              <Calendar className="w-5 h-5" /> My Trips
            </button>
            <button onClick={() => setActiveTab('friends')} className={`flex-1 py-2 rounded bg-white shadow font-semibold flex items-center justify-center gap-2 border border-gray-200 ${activeTab === 'friends' ? 'ring-2 ring-primary' : ''}`}>
              <span className="w-5 h-5 inline-block">👥</span> Friends
            </button>
            <button onClick={() => setActiveTab('map')} className={`flex-1 py-2 rounded bg-white shadow font-semibold flex items-center justify-center gap-2 border border-gray-200 ${activeTab === 'map' ? 'ring-2 ring-primary' : ''}`}>
              <span className="w-5 h-5 inline-block">🌍</span> Travel Map
            </button>
          </div>
          {/* Tab content */}
          {activeTab === 'trips' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Trips</h2>
                <Link href="/new-trip" className="text-base font-medium text-gray-700 hover:underline">Create New Trip</Link>
              </div>
              <TripsListCards />
            </>
          )}
          {activeTab === 'friends' && (
            <FriendsTab showAddFriend={showAddFriend} setShowAddFriend={setShowAddFriend} />
          )}
          {activeTab === 'map' && (
            <div className="text-center text-gray-500 py-20">Travel Map coming soon...</div>
          )}
        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          profile={profile}
          setProfile={setProfile}
          onClose={() => setShowEditProfile(false)}
          toast={toast}
        />
      )}
    </div>
  );
}

// Trip cards grid for main content
function TripsListCards() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get<Trip[]>("http://localhost:8000/trips/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(response.data);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
        toast({ title: "Error", description: "Failed to load trips. Please try again.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p className="text-lg text-gray-500">Loading trips...</p></div>;
  }

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          <Card key={trip.id} className="flex flex-col h-full rounded-xl overflow-hidden">
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              {trip.image_url ? (
                <img src={`http://localhost:8000${trip.image_url}`} alt="Trip" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-gray-300">🗺️</span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-xl font-bold mb-1 truncate">{trip.name}</div>
              <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {/* Show up to 3 cities if available in description */}
                {trip.description?.split(",").slice(0, 3).join(", ")}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Collaborators: {/* Placeholder for avatars or count */}
                {trip.collaborators && trip.collaborators.length > 0 ? (
                  <span className="ml-1">{trip.collaborators.length}</span>
                ) : (
                  <span className="ml-1 text-gray-300">—</span>
                )}
              </div>
              <Link href={`/trips/${trip.id}`} className="mt-auto text-primary font-semibold hover:underline">View Trip</Link>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// Friends tab content
function FriendsTab({ showAddFriend, setShowAddFriend }: { showAddFriend: boolean, setShowAddFriend: (v: boolean) => void }) {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [showSentModal, setShowSentModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();

  // Fetch friends, received requests, and sent requests
  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [friendsRes, requestsRes, sentRes] = await Promise.all([
          axios.get<User[]>("http://localhost:8000/users/me/friends", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<User[]>("http://localhost:8000/users/me/friend-requests", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<User[]>("http://localhost:8000/users/me/friend-requests/sent", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setFriends(friendsRes.data);
        setRequests(requestsRes.data);
        setSentRequests(sentRes.data);
      } catch (error) {
        console.error("Failed to fetch friends and requests:", error);
        toast({
          title: "Error",
          description: "Failed to load friends and requests. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchFriendsAndRequests();
  }, [toast]);

  // Handle friend request actions
  const handleAcceptRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(
        `http://localhost:8000/users/me/friend-requests/${userId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const acceptedUser = requests.find(r => r.id === userId);
      if (acceptedUser) {
        setFriends(prev => [...prev, acceptedUser]);
        setRequests(prev => prev.filter(r => r.id !== userId));
      }

      toast({ title: "Success", description: "Friend request accepted" });
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(
        `http://localhost:8000/users/me/friend-requests/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setRequests(prev => prev.filter(r => r.id !== userId));
      toast({ title: "Success", description: "Friend request declined" });
    } catch (error) {
      console.error("Failed to decline friend request:", error);
      toast({
        title: "Error",
        description: "Failed to decline friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFriend = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(
        `http://localhost:8000/users/me/friends/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setFriends(prev => prev.filter(f => f.id !== userId));
      toast({ title: "Success", description: "Friend removed" });
    } catch (error) {
      console.error("Failed to remove friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(
        `http://localhost:8000/users/me/friend-requests/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({ title: "Success", description: "Friend request sent" });
    } catch (error: any) {
      console.error("Failed to send friend request:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Debounced search function
  useEffect(() => {
    const searchUsers = async () => {
      if (search.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<User[]>(
          `http://localhost:8000/trips/users/search?query=${encodeURIComponent(search)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSearchResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  // Cancel sent friend request
  const handleCancelSentRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      // Use the same endpoint as decline (removes from sent)
      await axios.delete(
        `http://localhost:8000/users/me/friend-requests/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSentRequests(prev => prev.filter(u => u.id !== userId));
      toast({ title: "Success", description: "Friend request cancelled" });
    } catch (error) {
      console.error("Failed to cancel sent request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel sent request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold mr-auto">Friends</h2>
        <div className="flex gap-1">
          <Button onClick={() => setShowAddFriend(true)}>Add Friend</Button>
          <Button variant="outline" onClick={() => setShowSentModal(true)} aria-label="Pending Sent Requests" title="Pending Sent Requests">
            <Handshake className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">Your Friends</h3>
          <ul className="bg-white rounded-xl shadow p-4">
            {friends.length === 0 ? (
              <li className="text-gray-500">No friends yet.</li>
            ) : (
              friends.map(f => (
                <li key={f.id} className="py-2 border-b last:border-b-0 flex items-center justify-between">
                  <span>{f.username} <span className="text-gray-400 text-xs">({f.email})</span></span>
                  <Button size="sm" variant="destructive" onClick={() => handleRemoveFriend(f.id)}>Remove</Button>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Friend Requests</h3>
          <ul className="bg-white rounded-xl shadow p-4">
            {requests.length === 0 ? (
              <li className="text-gray-500">No requests.</li>
            ) : (
              requests.map(r => (
                <li key={r.id} className="py-2 border-b last:border-b-0 flex items-center justify-between">
                  <span>{r.username} <span className="text-gray-400 text-xs">({r.email})</span></span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" onClick={() => handleAcceptRequest(r.id)}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeclineRequest(r.id)}>Decline</Button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400" onClick={() => setShowAddFriend(false)}><X /></button>
            <h2 className="text-xl font-bold mb-4">Add Friend</h2>
            <div className="relative">
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Search by username or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
            {search.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <div className="text-gray-500 text-sm py-2">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="divide-y">
                    {searchResults.map(u => (
                      <li key={u.id} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{u.username}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                        <Button size="sm" variant="default" onClick={() => handleSendRequest(u.id)}>Send Request</Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm py-2">No users found</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Pending Sent Requests Modal */}
      {showSentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400" onClick={() => setShowSentModal(false)}><X /></button>
            <h2 className="text-xl font-bold mb-4">Pending Sent Friend Requests</h2>
            {sentRequests.length === 0 ? (
              <div className="text-gray-500 text-sm">No pending sent requests.</div>
            ) : (
              <ul className="divide-y">
                {sentRequests.map(u => (
                  <li key={u.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{u.username}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleCancelSentRequest(u.id)}>Cancel</Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
