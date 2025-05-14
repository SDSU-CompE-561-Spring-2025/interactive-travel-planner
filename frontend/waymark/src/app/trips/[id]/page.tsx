"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, MapPin, ArrowLeft, DollarSign, Trash2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

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

interface Itinerary {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
}

export default function TripDetailsPage({ params }: { params: { id: string } }) {
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [inviteOpen, setInviteOpen] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const fetchTripDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get<Trip>(`http://localhost:8000/trips/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data) {
                throw new Error('No trip data received');
            }

            console.log('Trip details:', {
                id: response.data.id,
                name: response.data.name,
                location: response.data.location,
                description: response.data.description,
                budget: response.data.budget
            });
            setTrip(response.data);
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

    const handleDeleteItinerary = async (itineraryId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Confirm before deleting
            if (!confirm('Are you sure you want to delete this itinerary?')) {
                return;
            }

            await axios.delete(`http://localhost:8000/itineraries/${itineraryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Immediately update the UI
            if (trip) {
                setTrip({
                    ...trip,
                    itineraries: trip.itineraries.filter(i => i.id !== itineraryId)
                });
            }

            toast.success('Itinerary deleted successfully');
        } catch (error: any) {
            console.error('Failed to delete itinerary:', error);
            if (error.response?.status === 404) {
                // If we get a 404, the itinerary was probably already deleted
                if (trip) {
                    setTrip({
                        ...trip,
                        itineraries: trip.itineraries.filter(i => i.id !== itineraryId)
                    });
                }
                toast.success('Itinerary deleted successfully');
            } else {
                toast.error('Failed to delete itinerary');
            }
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchTripDetails();
        }
    }, [params.id]);

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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
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
                            <div className="flex justify-end gap-4 mb-6">
                                <button
                                    className="bg-[#f3a034] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#f3a034]/90 transition-colors"
                                    onClick={() => router.push(`/trips/${params.id}/create-itinerary`)}
                                >
                                    Add Activity
                                </button>
                                <button
                                    className="bg-[#4ba46c] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#377c68]/90 transition-colors"
                                    onClick={() => setInviteOpen(true)}
                                >
                                    <UserPlus className="h-5 w-5" />
                                    Invite Collaborators
                                </button>
                            </div>
                        </div>

                        {/* Invite Collaborators Modal (placeholder) */}
                        {inviteOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                                    <button
                                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setInviteOpen(false)}
                                    >
                                        ×
                                    </button>
                                    <h2 className="text-xl font-bold mb-4 text-[#377c68]">Invite Collaborators</h2>
                                    <p className="mb-4 text-gray-600">(Collaborator invite functionality coming soon!)</p>
                                    {/* TODO: Add invite form here */}
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
                            <h2 className="text-2xl font-bold text-[#377c68] mb-6">Itinerary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trip?.itineraries.map((itinerary) => (
                                    <div
                                        key={itinerary.id}
                                        className="bg-[#fff8f0] rounded-lg p-6 hover:shadow-md transition-shadow relative"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-[#377c68]">{itinerary.name}</h3>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteItinerary(itinerary.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <p className="text-gray-600 mb-4">{itinerary.description}</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">Start:</span> {formatDateTime(itinerary.start_date)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">End:</span> {formatDateTime(itinerary.end_date)}
                                            </div>
                                        </div>
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
