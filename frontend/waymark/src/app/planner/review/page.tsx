'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Calendar, MapPin, Activity, DollarSign, Users } from 'lucide-react';
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

            const response = await axios.post(
                'http://localhost:8000/trips/',
                {
                    name: tripData.name,
                    description: `A ${formatBudget(tripData.budget)} trip to ${tripData.location} with activities: ${getActivityLabels().join(', ')}`,
                    location: tripData.location,
                    start_date: tripData.startDate,
                    end_date: tripData.endDate,
                    itineraries: [],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

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
            className="flex flex-col items-center justify-center min-h-[80vh] py-8"
        >
            <motion.h1 
                className="text-4xl font-bold mb-8 text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Review Your Trip
            </motion.h1>

            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {tripData.name || 'Unnamed Trip'}
                            </h2>
                            <p className="text-gray-500">
                                Here's a summary of your trip details
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Calendar className="text-blue-500 mt-1" size={24} />
                                <div>
                                    <h3 className="font-medium text-gray-700">Dates</h3>
                                    <p className="text-gray-600">
                                        {tripData.startDate && tripData.endDate ? (
                                            `${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}`
                                        ) : (
                                            'Dates not set'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="text-blue-500 mt-1" size={24} />
                                <div>
                                    <h3 className="font-medium text-gray-700">Location</h3>
                                    <p className="text-gray-600">
                                        {tripData.location || 'Location not set'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Activity className="text-blue-500 mt-1" size={24} />
                                <div>
                                    <h3 className="font-medium text-gray-700">Activities</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {getActivityLabels().map((label, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <DollarSign className="text-blue-500 mt-1" size={24} />
                                <div>
                                    <h3 className="font-medium text-gray-700">Budget</h3>
                                    <p className="text-gray-600">
                                        {tripData.budget ? formatBudget(tripData.budget) : 'Budget not set'}
                                    </p>
                                </div>
                            </div>

                            {tripData.collaborators?.length > 0 && (
                                <div className="flex items-start gap-4">
                                    <Users className="text-blue-500 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-medium text-gray-700">Collaborators</h3>
                                        <div className="space-y-1 mt-1">
                                            {tripData.collaborators.map((email, index) => (
                                                <p key={index} className="text-gray-600">
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

                <div className="flex justify-between gap-4 mt-8">
                    <motion.button
                        onClick={() => router.push('/planner/collab')}
                        className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back
                    </motion.button>
                    <motion.button
                        onClick={handleCreateTrip}
                        disabled={isCreating}
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={isCreating ? {} : { scale: 1.05 }}
                        whileTap={isCreating ? {} : { scale: 0.95 }}
                    >
                        {isCreating ? 'Creating Trip...' : 'Create Trip'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
} 