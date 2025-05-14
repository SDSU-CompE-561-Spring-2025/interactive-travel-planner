'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PlusCircle, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Trip {
    id: number;
    title: string;
    destination: string;
    start_date: string;
    end_date: string;
    description: string;
}

export default function DashboardPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get<Trip[]>('http://localhost:8000/trips/my-trips');
                setTrips(response.data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#fff8f0] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#377c68]">My Trips</h1>
                        <Link 
                            href="/new-trip"
                            className="btn-primary flex items-center gap-2"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Create New Trip
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3a034] mx-auto"></div>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
                            <p className="text-gray-500 mb-4">Start planning your next adventure!</p>
                            <Link 
                                href="/new-trip"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Create Your First Trip
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <Link 
                                    key={trip.id}
                                    href={`/trips/${trip.id}`}
                                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                                >
                                    <h3 className="text-xl font-semibold text-[#377c68] mb-2">{trip.title}</h3>
                                    <div className="flex items-center gap-2 text-[#4ba46c] mb-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{trip.destination}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#f3a034]">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                                    </div>
                                    {trip.description && (
                                        <p className="mt-2 text-gray-600 line-clamp-2">{trip.description}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
} 