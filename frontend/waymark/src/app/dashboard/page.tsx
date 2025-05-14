'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { MapPin, Calendar, Trash2, Users, Globe } from 'lucide-react';
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
    location: string;
    collaborators?: number;
}

interface UserStats {
    trips: number;
    countries: number;
    friends: number;
}

export default function DashboardPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState<UserStats>({ trips: 0, countries: 0, friends: 0 });
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
                    >
                        <Users className="h-5 w-5" />
                        Friends
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-gray-600 font-semibold flex items-center gap-2 px-6 py-2"
                    >
                        <Globe className="h-5 w-5" />
                        Travel Map
                    </Button>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {/* Profile Section */}
                        <div className="w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 bg-[#377c68]/10 rounded-full mb-4 flex items-center justify-center">
                                        <Users className="h-12 w-12 text-[#377c68]" />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-1">User Name</h2>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>No location set</span>
                                    </div>
                                    <p className="text-gray-600 text-sm text-center mb-4">
                                        No bio yet
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Edit Profile
                                    </Button>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold mb-4">Stats</h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-[#377c68]">{userStats.trips}</div>
                                            <div className="text-sm text-gray-600">Trips</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-[#377c68]">{userStats.countries}</div>
                                            <div className="text-sm text-gray-600">Countries</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-[#377c68]">{userStats.friends}</div>
                                            <div className="text-sm text-gray-600">Friends</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold mb-4">Social</h3>
                                    <p className="text-gray-600 text-sm">No social links added</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
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
                                    {trips.map((trip) => (
                                        <Link 
                                            key={trip.id}
                                            href={`/trips/${trip.id}`}
                                            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                        >
                                            <div className="h-40 bg-[#377c68]/10 relative flex items-center justify-center">
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
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                                                </div>
                                                {trip.collaborators && (
                                                    <div className="mt-3 text-sm text-gray-600">
                                                        Collaborators: {trip.collaborators}
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 