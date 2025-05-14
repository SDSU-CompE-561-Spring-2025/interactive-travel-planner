'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { MapPin, Calendar, Trash2, Globe, DollarSign } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Collaborator {
    id: number;
    username: string;
}

interface Trip {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    budget: number | null;
    collaborators?: Collaborator[];
    owner_name?: string;
    color?: string;
}

export default function DashboardPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get<Trip[]>('/trips/');
            setTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            toast.error('Failed to fetch trips');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, [router]);

    const handleDelete = async (tripId: number, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent the Link navigation
        try {
            await axios.delete(`/trips/`, {
                params: {
                    trip_id: tripId
                }
            });

            toast.success('Trip deleted successfully');
            // Refresh the trips list
            fetchTrips();
        } catch (error) {
            console.error('Failed to delete trip:', error);
            toast.error('Failed to delete trip');
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#fff8f0]">
                {/* Navigation Tabs */}
                <div className="flex justify-center gap-4 py-4 bg-white shadow-sm mb-8">
                    <Button
                        variant="ghost"
                        className="text-[#f3a034] font-semibold flex items-center gap-2 px-6 py-2 border-b-2 border-[#f3a034]"
                    >
                        <Calendar className="h-5 w-5" />
                        My Trips
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-gray-600 font-semibold flex items-center gap-2 px-6 py-2"
                        onClick={() => router.push('/dashboard/map')}
                    >
                        <Globe className="h-5 w-5" />
                        Travel Map
                    </Button>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-[#377c68]">My Trips</h1>
                        <Link
                            href="/planner/start"
                            className="bg-[#f3a034] text-white px-4 py-2 rounded-md hover:bg-[#f3a034]/90 transition-colors flex items-center gap-2"
                        >
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
                                href="/planner/start"
                                className="bg-[#f3a034] text-white px-4 py-2 rounded-md hover:bg-[#f3a034]/90 transition-colors inline-flex items-center gap-2"
                            >
                                Create Your First Trip
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {trips.map((trip) => {
                                // Convert hex color to rgba with 0.2 alpha for background
                                function hexToRgba(hex: string, alpha: number) {
                                    let c = hex.replace('#', '');
                                    if (c.length === 3) c = c.split('').map(x => x + x).join('');
                                    const num = parseInt(c, 16);
                                    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
                                }
                                const bgColor = trip.color ? hexToRgba(trip.color, 0.2) : 'rgba(55,124,104,0.1)';
                                return (
                                    <Link
                                        key={trip.id}
                                        href={`/trips/${trip.id}`}
                                        className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                    >
                                        <div
                                            className="h-40 relative flex items-center justify-center"
                                            style={{ backgroundColor: trip.color || '#377c68' }}
                                        >
                                            <Globe className="h-16 w-16 text-[#377c68]/30" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-red-500 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => handleDelete(trip.id, e)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-xl font-semibold text-[#377c68] mb-2">{trip.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{trip.location || 'No location set'}</span>
                                            </div>
                                            {trip.owner_name && (
                                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                    <span className="font-medium">Owner:</span>
                                                    <span>{trip.owner_name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                                            </div>
                                            {trip.budget && (
                                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Budget: ${trip.budget.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {trip.collaborators && trip.collaborators.length > 0 && (
                                                <div className="mt-3 text-sm text-gray-600">
                                                    Collaborators: {trip.collaborators.map(c => c.username).join(', ')}
                                                </div>
                                            )}
                                            <Button
                                                variant="ghost"
                                                className="w-full mt-4 text-[#f3a034] hover:text-[#f3a034]/90"
                                            >
                                                View Trip
                                            </Button>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
