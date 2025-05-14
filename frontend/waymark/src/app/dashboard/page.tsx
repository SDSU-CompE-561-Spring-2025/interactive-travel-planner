'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PlusCircle, MapPin, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Trip {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
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

            const response = await axios.get<Trip[]>('http://localhost:8000/trips/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            await axios.delete(`http://localhost:8000/trips/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
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
            <div className="min-h-screen bg-[#fff8f0] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#377c68]">My Trips</h1>
                        <Link 
                            href="/planner/start"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
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
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Create Your First Trip
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <Link 
                                    key={trip.id}
                                    href={`/trips/${trip.id}`}
                                    className="group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 relative"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDelete(trip.id, e)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                    <h3 className="text-xl font-semibold text-[#377c68] mb-2">{trip.name}</h3>
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