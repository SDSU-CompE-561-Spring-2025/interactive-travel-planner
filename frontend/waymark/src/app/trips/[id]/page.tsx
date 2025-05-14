"use client";

import { useEffect, useState, useRef, use as usePromise } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft, DollarSign, Trash2, UserPlus, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from '@/lib/axios';

interface ActivityOption {
    id: string;
    label: string;
    icon: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
    { id: 'sightseeing', label: 'Sightseeing', icon: '🏛️' },
    { id: 'beach', label: 'Beach Activities', icon: '🏖️' },
    { id: 'hiking', label: 'Hiking', icon: '🥾' },
    { id: 'food', label: 'Food & Dining', icon: '🍽️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'museums', label: 'Museums', icon: '🏛️' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
    { id: 'adventure', label: 'Adventure Sports', icon: '🏄‍♂️' },
    { id: 'relaxation', label: 'Relaxation', icon: '🧘‍♀️' },
    { id: 'cultural', label: 'Cultural Activities', icon: '🎭' },
];

interface Collaborator {
    id: number;
    username: string;
}

interface Trip {
    id: number;
    name: string;
    description: string;
    location: string;
    budget: number | null;
    start_date: string;
    end_date: string;
    activities: string[];
    itineraries: Itinerary[];
    collaborators?: Collaborator[];
}

interface Itinerary {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    activities: string[];
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return typeof (value as any)?.then === 'function';
}

export default function TripDetailsPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
    // Unwrap params if it's a Promise (Next.js 15+)
    const unwrappedParams = isPromise(params) ? usePromise(params) : params;
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [inviteOpen, setInviteOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

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

    const handleDeleteItinerary = async (itineraryId: number) => {
        if (!confirm('Are you sure you want to delete this itinerary?')) {
            return;
        }

        try {
            await axios.delete(`/itineraries/${itineraryId}`);
            if (trip) {
                setTrip({
                    ...trip,
                    itineraries: trip.itineraries.filter(it => it.id !== itineraryId)
                });
            }
            toast.success('Itinerary deleted successfully');
        } catch (error) {
            console.error('Error deleting itinerary:', error);
            toast.error('Failed to delete itinerary');
        }
    };

    // Search for users by username
    const handleSearch = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/users/search?query=${encodeURIComponent(value)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
    };

    const handleInviteCollaborator = async (userId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/trips/${unwrappedParams.id}/collaborators`, { user_id: userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Collaborator added!');
            setInviteOpen(false);
            setSearch('');
            setSearchResults([]);
            // Refresh trip details
            const response = await axios.get<Trip>(`/trips/${unwrappedParams.id}`);
            setTrip(response.data);
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || 'Failed to add collaborator');
        }
    };

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await axios.get<Trip>(`/trips/${unwrappedParams.id}`);

                if (!response.data) {
                    throw new Error('No trip data received');
                }

                setTrip(response.data);
            } catch (error) {
                console.error('Failed to fetch trip details:', error);
                toast.error('Failed to fetch trip details');
            } finally {
                setLoading(false);
            }
        };

        if (unwrappedParams.id) {
            fetchTripDetails();
        }
    }, [unwrappedParams.id, router]);

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
                            {trip.description}
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
                                    {trip.collaborators && Array.isArray(trip.collaborators) && trip.collaborators.length > 0 && (
                                        <div className="inline-flex items-center gap-2 text-gray-600 px-4 py-2 bg-[#fff8f0] rounded-full">
                                            <span className="font-medium">Collaborators:</span>
                                            <span>{trip.collaborators.map(c => c.username).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mb-6">
                                <button
                                    className="bg-[#f3a034] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#f3a034]/90 transition-colors"
                                    onClick={() => router.push(`/trips/${unwrappedParams.id}/create-itinerary`)}
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

                        {/* Invite Collaborators Modal */}
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
                                    <label className="block mb-2 text-gray-700">Search by username</label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => handleSearch(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ba46c] mb-2"
                                        placeholder="Type a username..."
                                        autoFocus
                                    />
                                    {searchLoading && <div className="text-sm text-gray-400 mb-2">Searching...</div>}
                                    {search && searchResults.length > 0 && (
                                        <ul className="border rounded-lg bg-white shadow max-h-40 overflow-y-auto mb-2">
                                            {searchResults.map((user: any) => (
                                                <li
                                                    key={user.id}
                                                    className="px-4 py-2 hover:bg-[#f3a034]/10 cursor-pointer"
                                                    onClick={() => handleInviteCollaborator(user.id)}
                                                >
                                                    {user.username}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {search && !searchLoading && searchResults.length === 0 && (
                                        <div className="text-sm text-gray-400 mb-2">No users found.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Activities Section */}
                        {trip.activities && trip.activities.length > 0 && (
                            <div className="mb-8 p-6 bg-[#fff8f0] rounded-lg">
                                <h2 className="text-xl font-semibold text-[#377c68] mb-4">Trip Activities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {trip.activities.map((activityId) => {
                                        const activityOption = ACTIVITY_OPTIONS.find(opt => opt.id === activityId);
                                        if (!activityOption) return null;

                                        const isPlanned = trip.itineraries.some(
                                            itinerary => itinerary.activities?.includes(activityId)
                                        );

                                        return (
                                            <div
                                                key={activityId}
                                                className={`
                                                    flex items-center p-3 rounded-lg border transition-all duration-200
                                                    ${isPlanned
                                                        ? 'border-[#f3a034] bg-[#f3a034]/10 text-[#377c68]'
                                                        : 'border-gray-200 bg-white text-gray-500'}
                                                `}
                                            >
                                                <span className="text-xl mr-2">{activityOption.icon}</span>
                                                <span className="text-sm font-medium">{activityOption.label}</span>
                                                {isPlanned && (
                                                    <Check className="h-4 w-4 text-[#f3a034] ml-auto" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Itineraries Section */}
                        <div>
                            <div className="flex justify-between items-center mb-6">

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trip.itineraries.map((itinerary) => (
                                    <div
                                        key={itinerary.id}
                                        className="bg-[#fff8f0] rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-[#377c68]">{itinerary.name}</h3>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
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
                                            {itinerary.activities && itinerary.activities.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Activities:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {itinerary.activities.map((activity, index) => {
                                                            const activityOption = ACTIVITY_OPTIONS.find(opt => opt.id === activity);
                                                            return activityOption ? (
                                                                <div
                                                                    key={index}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#377c68]/10 text-[#377c68] rounded-full text-sm"
                                                                >
                                                                    <span>{activityOption.icon}</span>
                                                                    <span>{activityOption.label}</span>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {trip.itineraries.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-gray-500">
                                        No itineraries yet. Click "Add Activity" to start one.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
