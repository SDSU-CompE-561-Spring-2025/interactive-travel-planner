'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Calendar, MapPin, Activity, DollarSign, Users, ClipboardCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ACTIVITY_OPTIONS = [
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

interface TripResponse {
    id: number;
    name: string;
    description: string;
    location: string;
    budget: number | null;
    start_date: string;
    end_date: string;
    itineraries: number[];
}

export default function ReviewStep() {
    const router = useRouter();
    const { tripData, resetTripData } = useTripPlanner();
    const [isCreating, setIsCreating] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatBudget = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getActivityLabels = () => {
        return (tripData.activities || [])
            .map(id => ACTIVITY_OPTIONS.find(opt => opt.id === id))
            .filter(Boolean)
            .map(activity => activity?.label);
    };

    const handleCreateTrip = async () => {
        setIsCreating(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const tripPayload = {
                name: tripData.name,
                description: `A ${formatBudget(tripData.budget)} trip to ${tripData.location} with activities: ${getActivityLabels().join(', ')}`,
                location: tripData.location,
                budget: tripData.budget,
                start_date: tripData.startDate,
                end_date: tripData.endDate,
                activities: tripData.activities || [],
                itineraries: [],
            };

            console.log('Creating trip with data:', tripPayload);

            const response = await axios.post<TripResponse>(
                'http://localhost:8000/trips/',
                tripPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Trip created successfully:', response.data);
            toast.success('Trip created successfully!');
            resetTripData();
            router.push(`/trips/${response.data.id}`);
        } catch (error) {
            console.error('Failed to create trip:', error);
            toast.error('Failed to create trip. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-screen bg-[#fff8f0] py-12"
        >
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardCheck className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <motion.h1 
                            className="text-4xl font-bold mb-4 text-[#377c68]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Review Your Trip
                        </motion.h1>
                        <p className="text-lg text-[#4ba46c]">
                            Here's a summary of your trip details
                        </p>
                    </div>

                    <div className="w-full max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[#377c68]/10"
                        >
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-[#377c68]">
                                        {tripData.name || 'Unnamed Trip'}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <Calendar className="text-[#f3a034] mt-1" size={24} />
                                        <div>
                                            <h3 className="font-medium text-[#377c68]">Dates</h3>
                                            <p className="text-[#4ba46c]">
                                                {tripData.startDate && tripData.endDate ? (
                                                    `${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}`
                                                ) : (
                                                    'Dates not set'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <MapPin className="text-[#f3a034] mt-1" size={24} />
                                        <div>
                                            <h3 className="font-medium text-[#377c68]">Location</h3>
                                            <p className="text-[#4ba46c]">
                                                {tripData.location || 'Location not set'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Activity className="text-[#f3a034] mt-1" size={24} />
                                        <div>
                                            <h3 className="font-medium text-[#377c68]">Activities</h3>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {getActivityLabels().map((label, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-[#f3a034]/10 text-[#377c68] rounded-full text-sm"
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <DollarSign className="text-[#f3a034] mt-1" size={24} />
                                        <div>
                                            <h3 className="font-medium text-[#377c68]">Budget</h3>
                                            <p className="text-[#4ba46c]">
                                                {tripData.budget ? formatBudget(tripData.budget) : 'Budget not set'}
                                            </p>
                                        </div>
                                    </div>

                                    {tripData.collaborators?.length > 0 && (
                                        <div className="flex items-start gap-4">
                                            <Users className="text-[#f3a034] mt-1" size={24} />
                                            <div>
                                                <h3 className="font-medium text-[#377c68]">Collaborators</h3>
                                                <div className="space-y-1 mt-1">
                                                    {tripData.collaborators.map((email, index) => (
                                                        <p key={index} className="text-[#4ba46c]">
                                                            {email}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex justify-center gap-4 mt-8">
                            <motion.button
                                onClick={() => router.push('/planner/collab')}
                                className="px-6 py-3 rounded-lg text-[#377c68] hover:text-[#4ba46c] transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Back
                            </motion.button>
                            <motion.button
                                onClick={handleCreateTrip}
                                disabled={isCreating}
                                className={`bg-[#f3a034] text-white px-8 py-3 rounded-lg shadow-lg hover:bg-[#f3a034]/90 transition-colors duration-200 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                whileHover={isCreating ? {} : { scale: 1.05 }}
                                whileTap={isCreating ? {} : { scale: 0.95 }}
                            >
                                {isCreating ? 'Creating Trip...' : 'Create Trip'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 