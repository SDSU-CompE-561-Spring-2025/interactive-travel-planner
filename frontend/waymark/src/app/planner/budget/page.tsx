'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Slider } from '@/components/ui/slider';
import { Wallet } from 'lucide-react';

export default function BudgetStep() {
    const router = useRouter();
    const { tripData, updateTripData } = useTripPlanner();
    const [error, setError] = useState('');

    const handleBudgetChange = (value: number[]) => {
        updateTripData('budget', value[0]);
        setError('');
    };

    const handleNext = () => {
        if (!tripData.budget) {
            setError('Please select a budget');
            return;
        }
        router.push('/planner/collab');
    };

    const formatBudget = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
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
                            <Wallet className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <motion.h1
                            className="text-4xl font-bold mb-4 text-[#377c68]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            What's your budget?
                        </motion.h1>
                        <p className="text-lg text-[#4ba46c]">
                            Set your total trip budget
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium text-[#377c68]">
                                        Total Budget
                                    </span>
                                    <span className="text-lg font-bold text-[#f3a034]">
                                        {formatBudget(tripData.budget || 500)}
                                    </span>
                                </div>

                                <Slider
                                    value={[tripData.budget || 500]}
                                    onValueChange={handleBudgetChange}
                                    min={50}
                                    max={100000}
                                    step={50}
                                    className="w-full"
                                />
                            </motion.div>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
                        )}

                        <div className="flex justify-center gap-4 mt-8">
                            <motion.button
                                onClick={() => router.push('/planner/activities')}
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
                </div>
            </div>
        </motion.div>
    );
}
