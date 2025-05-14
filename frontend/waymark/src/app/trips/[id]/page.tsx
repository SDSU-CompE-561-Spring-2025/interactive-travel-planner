"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Calendar, MapPin, ArrowLeft, DollarSign, Trash2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { Location } from '@/components/ItineraryMap';

// Dynamically import the map component to avoid SSR issues
const ItineraryMap = dynamic(() => import('@/components/ItineraryMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-gray-500 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                <span>Loading map...</span>
            </div>
        </div>
    ),
});

interface ItineraryLocation {
    id: number;
    name: string;
    description: string | null;
    latitude: number;
    longitude: number;
}

interface Itinerary {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    locations: ItineraryLocation[];
}

interface Trip {
    id: number;
    name: string;
    description: string;
    location: string;
    budget: number | null;
    start_date: string;
    end_date: string;
    itineraries: Itinerary[];
}

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
    const [mapZoom, setMapZoom] = useState(2);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDeleteItinerary = async (itineraryId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axiosInstance.delete(`/itineraries/${itineraryId}`);
            toast.success('Itinerary deleted successfully');
            // Refresh trip data
            fetchTripDetails();
        } catch (error) {
            console.error('Failed to delete itinerary:', error);
            toast.error('Failed to delete itinerary');
        }
    };

    const fetchTripDetails = async () => {
        try {
            const response = await axiosInstance.get<Trip>(`/trips/${resolvedParams.id}`);
            if (!response.data) {
                throw new Error('No trip data received');
            }

            setTrip(response.data);

            // Set map center to the first location of the first itinerary with locations
            const firstItineraryWithLocations = response.data.itineraries.find(itin => itin.locations?.length > 0);
            if (firstItineraryWithLocations?.locations[0]) {
                const firstLoc = firstItineraryWithLocations.locations[0];
                setMapCenter([firstLoc.latitude, firstLoc.longitude]);
                setMapZoom(12);
            }
        } catch (error) {
            console.error('Failed to fetch trip details:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: any; headers?: any } };
                console.error('Error details:', {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data,
                    headers: axiosError.response?.headers
                });
                toast.error(`Failed to fetch trip details: ${axiosError.response?.data?.detail || 'Unknown error'}`);
            } else {
                toast.error('Failed to fetch trip details');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (resolvedParams.id) {
            fetchTripDetails();
        }
    }, [resolvedParams.id, router]);

    const handleSelectLocation = (location: Location) => {
        setSelectedLocation(location);
        setMapCenter(location.coordinates);
        setMapZoom(12);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3a034]"></div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#377c68] mb-4">Trip not found</h1>
                    <Link href="/dashboard" className="text-[#f3a034] hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Combine all locations from all itineraries
    const allLocations: Location[] = trip.itineraries.flatMap(itinerary =>
        (itinerary.locations || []).map(loc => ({
            id: `${itinerary.id}-${loc.id}`,
            name: `${loc.name} (${itinerary.name})`,
            coordinates: [loc.latitude, loc.longitude],
            description: loc.description || ''
        }))
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#fff8f0]">
                {/* Header Image */}
                <div className="h-80 bg-[#377c68]/10 relative flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold text-[#377c68] mb-4">{trip.name}</h1>
                    <div className="flex items-center gap-2 text-[#377c68] text-lg">
                        <MapPin className="h-5 w-5" strokeWidth={2.5} />
                        <span className="font-medium">
                            {trip.location}
                        </span>
                    </div>
                    {trip.description && (
                        <p className="mt-4 text-[#377c68]/80 text-center max-w-2xl px-4">
                            {trip.description.replace(trip.location, `**${trip.location}**`).split('**').map((part, i) => (
                                i % 2 === 1 ? <span key={i} className="font-extrabold text-[#377c68]">{part}</span> : part
                            ))}
                        </p>
                    )}
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {/* Navigation and Trip Info */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-4">
                                <Link 
                                    href="/dashboard"
                                    className="text-[#377c68] hover:text-[#377c68]/80 flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Back
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <div className="inline-flex items-center gap-2 text-gray-600 px-4 py-2 bg-[#fff8f0] rounded-full">
                                        <Calendar className="h-5 w-5 text-[#377c68]" />
                                        <span className="whitespace-nowrap">
                                            {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                                        </span>
                                    </div>
                                    {trip.budget && (
                                        <div className="inline-flex items-center gap-2 text-gray-600 px-4 py-2 bg-[#fff8f0] rounded-full">
                                            <DollarSign className="h-5 w-5 text-[#377c68]" />
                                            <span>Budget: ${trip.budget.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                className="bg-[#f3a034] text-white hover:bg-[#f3a034]/90"
                                onClick={() => router.push(`/trips/${resolvedParams.id}/create-itinerary`)}
                            >
                                Create Itinerary
                            </Button>
                        </div>

                        {/* Map Section */}
                        {allLocations.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-[#377c68] mb-4">Trip Map</h2>
                                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                                    <ItineraryMap
                                        locations={allLocations}
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        onSelectLocation={handleSelectLocation}
                                        onMapMove={(center, zoom) => {
                                            setMapCenter(center);
                                            setMapZoom(zoom);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Activities Section */}
                        {trip.description && trip.description.includes('activities:') && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-[#377c68] mb-4">Activities</h2>
                                <div className="flex flex-wrap gap-2">
                                    {trip.description
                                        .split('activities:')[1]
                                        .split(',')
                                        .map((activity, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-[#fff8f0] rounded-full text-[#377c68]"
                                            >
                                                {activity.trim()}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Itineraries Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#377c68] mb-6">Itineraries</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trip?.itineraries.map((itinerary) => (
                                    <div
                                        key={itinerary.id}
                                        className="bg-[#fff8f0] rounded-lg p-6 hover:shadow-md transition-shadow relative group"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleDeleteItinerary(itinerary.id, e)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                        <h3 className="text-xl font-semibold text-[#377c68] mb-2">{itinerary.name}</h3>
                                        {itinerary.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {itinerary.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4 text-[#377c68]" />
                                            <span className="whitespace-nowrap">
                                                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-4 text-[#f3a034] hover:text-[#f3a034]/90"
                                            onClick={() => router.push(`/itineraries/${itinerary.id}`)}
                                        >
                                            View Itinerary
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
