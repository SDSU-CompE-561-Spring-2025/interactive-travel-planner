'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Check, Compass } from 'lucide-react';
import { ProgressBar } from '@/components/ProgressBar';

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

export default function ActivitiesStep() {
    const router = useRouter();
    const { tripData, updateTripData } = useTripPlanner();
    const [error, setError] = useState('');

    const handleActivityToggle = (activityId: string) => {
        const currentActivities = tripData.activities || [];
        const newActivities = currentActivities.includes(activityId)
            ? currentActivities.filter(id => id !== activityId)
            : [...currentActivities, activityId];
        
        updateTripData('activities', newActivities);
        setError('');
    };

    const handleNext = () => {
        if (!tripData.activities?.length) {
            setError('Please select at least one activity');
            return;
        }
        router.push('/planner/budget');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#fff8f0] py-12"
        >
            <div className="max-w-4xl mx-auto px-4">
                <ProgressBar currentStep="activities" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-2xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Compass className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#377c68] mb-4">
                            What interests you?
                        </h1>
                        <p className="text-lg text-[#4ba46c]">
                            Choose activities for your trip
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {ACTIVITY_OPTIONS.map((activity, index) => (
                            <motion.button
                                key={activity.id}
                                onClick={() => handleActivityToggle(activity.id)}
                                className={`
                                    flex items-center p-4 rounded-lg border transition-all duration-200
                                    ${tripData.activities?.includes(activity.id)
                                        ? 'border-[#f3a034] bg-[#f3a034]/10 text-[#377c68]'
                                        : 'border-[#4ba46c]/30 hover:border-[#f3a034] hover:bg-[#fff8f0]/80 text-[#377c68]'}
                                `}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="text-2xl mr-3">{activity.icon}</span>
                                <span className="flex-grow text-left font-medium">{activity.label}</span>
                                {tripData.activities?.includes(activity.id) && (
                                    <Check className="text-[#f3a034]" size={20} />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center mb-6">{error}</p>
                    )}

                    <div className="flex justify-center gap-4 pt-4">
                        <motion.button
                            onClick={() => router.push('/planner/location')}
                            className="px-6 py-3 rounded-lg text-[#377c68] hover:text-[#4ba46c] transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Back
                        </motion.button>
                        <motion.button
                            onClick={handleNext}
                            className="bg-[#f3a034] text-white px-8 py-3 rounded-lg shadow-lg hover:bg-[#f3a034]/90 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Next Step
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
} 