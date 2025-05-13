"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { HexColorPicker } from "react-colorful";

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
