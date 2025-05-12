"use client";

import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { TravelersImage } from "@/components/TravelersImage";
import { HowItWorks } from "@/components/how-it-works";


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
  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link href="/new-trip">
          <Button>Create New Trip</Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Trip cards will be added here */}
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
      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useContext(AuthContext);

  return user ? <TripsList /> : <LandingPage />;
}
