'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
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

interface ApiResponse {
    data: Itinerary;
}

export default function ItineraryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
    const [mapZoom, setMapZoom] = useState(2);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await axios.get<Itinerary>(
                    `http://localhost:8000/itineraries/${resolvedParams.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data) {
                    setItinerary(response.data);

                    // Set initial map center and zoom if there are locations
                    if (response.data.locations && response.data.locations.length > 0) {
                        const firstLocation = response.data.locations[0];
                        setMapCenter([firstLocation.latitude, firstLocation.longitude]);
                        setMapZoom(12);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch itinerary:', error);
                toast.error('Failed to load itinerary details');
            }
        };

        fetchItinerary();
    }, [resolvedParams.id, router]);

    const handleSelectLocation = (location: Location) => {
        setSelectedLocation(location);
        setMapCenter(location.coordinates);
        setMapZoom(12);
    };

    if (!itinerary) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-500 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                        <span>Loading itinerary...</span>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const locations: Location[] = itinerary.locations.map(loc => ({
        id: loc.id.toString(),
        name: loc.name,
        coordinates: [loc.latitude, loc.longitude],
        description: loc.description || ''
    }));

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            className="gap-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{itinerary.name}</h1>
                            {itinerary.description && (
                                <p className="text-gray-600 mb-4">{itinerary.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-5 w-5 text-[#377c68]" />
                                <span>
                                    {format(new Date(itinerary.start_date), 'PPP')} - {format(new Date(itinerary.end_date), 'PPP')}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {itinerary.locations.map((location) => (
                                        <div
                                            key={location.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => handleSelectLocation({
                                                id: location.id.toString(),
                                                name: location.name,
                                                coordinates: [location.latitude, location.longitude],
                                                description: location.description || ''
                                            })}
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-[#377c68]" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{location.name}</h3>
                                                    {location.description && (
                                                        <p className="text-sm text-gray-600">{location.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                                <ItineraryMap
                                    locations={locations}
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
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 