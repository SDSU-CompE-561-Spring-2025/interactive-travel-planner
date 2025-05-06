import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TravelersImage() {
    return (
        <div className=" px-9 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] items-center gap-8">
            <div>
            <img
                src="https://i.postimg.cc/Zn8k0hRp/Chat-GPT-Image-May-6-2025-12-03-05-AM.png"
                alt="Featured Itineraries"
                width={500}
                height={300}
                className="rounded-lg shadow-lg"
            />
            </div>

            <div className="flex justify-center md:justify-end">
                <h2 className="text-3xl font-bold mb-4">Explore the world with WayMark.</h2>
                <p className="mb-6 text-lg">
                    Create detailed itineraries and share them with fellow travelers.
                </p>
                <Button>Explore Trips</Button>
            </div>
        </div>
        </div>
    );
}
