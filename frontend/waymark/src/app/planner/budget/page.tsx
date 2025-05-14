'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Slider } from '@/components/ui/slider';

const BUDGET_RANGES = [
    { min: 500, max: 1000, label: 'Budget' },
    { min: 1000, max: 2500, label: 'Moderate' },
    { min: 2500, max: 5000, label: 'Luxury' },
    { min: 5000, max: 10000, label: 'Ultra Luxury' },
];

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
            setError('Please select a budget range');
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

    const getBudgetLabel = (value: number) => {
        const range = BUDGET_RANGES.find(range => value >= range.min && value <= range.max);
        return range ? range.label : 'Custom';
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh]"
        >
            <motion.h1 
                className="text-4xl font-bold mb-8 text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                What's your budget?
            </motion.h1>

            <div className="w-full max-w-md">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-700">
                                Budget Range
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                {formatBudget(tripData.budget || 500)}
                            </span>
                        </div>

                        <Slider
                            value={[tripData.budget || 500]}
                            onValueChange={handleBudgetChange}
                            min={500}
                            max={10000}
                            step={100}
                            className="w-full"
                        />

                        <div className="text-center">
                            <span className="text-sm font-medium text-gray-600">
                                {getBudgetLabel(tripData.budget || 500)} Range
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-50 p-4 rounded-lg"
                    >
                        <h3 className="font-medium text-gray-700 mb-2">Budget Categories:</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {BUDGET_RANGES.map(range => (
                                <li key={range.label} className="flex justify-between">
                                    <span>{range.label}:</span>
                                    <span>{formatBudget(range.min)} - {formatBudget(range.max)}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
                )}

                <div className="flex justify-between gap-4 mt-8">
                    <motion.button
                        onClick={() => router.push('/planner/activities')}
                        className="px-6 py-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back
                    </motion.button>
                    <motion.button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Next Step
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
} 