"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { HexColorPicker } from "react-colorful";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface TripResponse {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  itineraries: number[];
}

function renderErrorDetail(detail: any) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((err, idx) =>
      typeof err === "object" && err.msg ? <div key={idx}>{err.msg}</div> : <div key={idx}>{JSON.stringify(err)}</div>
    );
  }
  if (typeof detail === "object" && detail !== null) {
    if (detail.msg) return detail.msg;
    return JSON.stringify(detail);
  }
  return String(detail);
}

function LocationPicker({ value, onChange }: { value: [number, number] | null; onChange: (val: [number, number]) => void }) {
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fix for default marker icons in Leaflet with Next.js
  if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange([e.latlng.lat, e.latlng.lng]);
      },
    });
    return value ? <Marker position={value} icon={L.Icon.Default ? new L.Icon.Default() : undefined} /> : null;
  }

  function SearchFlyTo({ coords }: { coords: [number, number] | null }) {
    const map = useMap();
    if (coords) {
      map.flyTo(coords, 10);
    }
    return null;
  }

  const fetchSuggestions = async (query: string) => {
    setLoading(true);
    setSearchError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSearchError("Error searching location.");
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) return;
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSuggestionClick = (s: any) => {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    setSearch(s.display_name);
    setSuggestions([]);
    onChange([lat, lon]);
  };

  if (typeof window === 'undefined') return null;

  return (
    <div>
      <MapContainer center={value || [20, 0]} zoom={value ? 10 : 2} style={{ height: 300, width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        <SearchFlyTo coords={value} />
      </MapContainer>
      <div className="mt-2 relative">
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          placeholder="Search for a location"
          value={search}
          onChange={handleInputChange}
        />
        {loading && <div className="absolute right-2 top-2 text-xs">Loading...</div>}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 w-full mt-1 bg-white border rounded shadow max-h-48 overflow-auto">
            {suggestions.map((s, i) => (
              <li
                key={s.place_id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {searchError && <div className="text-red-500 text-xs mt-1">{searchError}</div>}
    </div>
  );
}

export default function NewTrip() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    itineraries: [] as number[]
  });
  const [image, setImage] = useState<File | null>(null);
  const [color, setColor] = useState("#aabbcc");
  const [showColorError, setShowColorError] = useState(false);
  const [showImageError, setShowImageError] = useState("");
  const [location, setLocation] = useState<[number, number] | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowColorError(false);
    setShowImageError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      if (!image && !color) {
        setShowColorError(true);
        setIsLoading(false);
        return;
      }
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("start_date", new Date(formData.start_date).toISOString());
      form.append("end_date", new Date(formData.end_date).toISOString());
      form.append("itineraries", JSON.stringify(formData.itineraries));
      if (image) {
        form.append("image", image);
      } else if (color) {
        form.append("color", color);
      }
      if (location) {
        form.append("latitude", String(location[0]));
        form.append("longitude", String(location[1]));
      }
      // Debug: log all FormData
      console.log("FormData being sent:");
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }
      const response = await axios.post<TripResponse>(
        "http://localhost:8000/trips/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Success!",
        description: "Your trip has been created successfully.",
      });
      router.push(`/trips/${response.data.id}`);
    } catch (error: any) {
      console.error("Failed to create trip:", error);
      toast({
        title: "Error",
        description: renderErrorDetail(error?.response?.data?.detail || error?.message),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setShowImageError("Image must be JPEG or PNG");
        setImage(null);
        return;
      }
      setShowImageError("");
      setImage(file);
    } else {
      setImage(null);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter trip name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your trip"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Trip Image (JPEG/PNG, optional)</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
              />
              {showImageError && (
                <div className="text-red-500 text-sm">{showImageError}</div>
              )}
            </div>

            {!image && (
              <div className="space-y-2">
                <Label htmlFor="color">Trip Color (if no image)</Label>
                <div className="flex items-center space-x-4">
                  <HexColorPicker color={color} onChange={setColor} />
                  <div
                    className="w-10 h-10 rounded-full border"
                    style={{ background: color }}
                  />
                </div>
                {showColorError && (
                  <div className="text-red-500 text-sm">Please select a color or upload an image.</div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Pick Destination on Map</Label>
              <LocationPicker value={location} onChange={setLocation} />
              {location && (
                <div className="text-xs text-muted-foreground mt-2">
                  Selected: {location[0].toFixed(4)}, {location[1].toFixed(4)}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
