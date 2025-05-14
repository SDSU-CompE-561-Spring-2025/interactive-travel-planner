'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { ProgressBar } from '@/components/ProgressBar';

export default function NameStep() {
    const router = useRouter();
    const tripId = useId();
    const { tripData, updateTripData } = useTripPlanner();
    const [name, setName] = useState(tripData.name || '');
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!name.trim()) {
            setError('Please enter a trip name');
            return;
        }
        updateTripData('name', name.trim());
        router.push('/planner/dates');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#fff8f0] py-12"
        >
            <div className="max-w-4xl mx-auto px-4">
                <ProgressBar currentStep="name" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Pencil className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#377c68] mb-4">
                            Let's name your trip!
                        </h1>
                        <p className="text-lg text-[#4ba46c]">
                            Give your adventure a memorable name
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label 
                                htmlFor={tripId}
                                className="block text-sm font-medium text-[#377c68]"
                            >
                                Trip Name
                            </label>
                            <input 
                                id={tripId}
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                placeholder="e.g., Summer in Paris 2024"
                                className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-[#4ba46c]/30'} focus:outline-none focus:ring-2 focus:ring-[#f3a034] bg-white text-[#377c68]`}
                            />
                            {error && (
                                <p className="text-sm text-red-500 mt-1">{error}</p>
                            )}
                        </div>

                        <div className="flex justify-between gap-4 pt-4">
                            <motion.button
                                onClick={() => router.push('/planner/start')}
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
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
} 