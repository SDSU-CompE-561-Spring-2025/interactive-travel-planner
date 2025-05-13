import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TravelersImage() {
    return (
        <div className="px-9 md:px-20 flex flex-col md:flex-row items-center justify-center gap-8">
            <div>
                <img
                    src="https://i.postimg.cc/Zn8k0hRp/Chat-GPT-Image-May-6-2025-12-03-05-AM.png"
                    alt="Featured Itineraries"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                />
            </div>
            <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
                <h2 className="text-3xl font-bold mb-4">Explore the world with WayMark.</h2>
                <p className="mb-6 text-lg">
                    Create detailed itineraries and share them with fellow travelers.
                </p>
                <Button className="min-w-[160px]">Explore Trips</Button>
            </div>
        </div>
    );
}
