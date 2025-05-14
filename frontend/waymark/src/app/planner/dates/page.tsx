'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { ProgressBar } from '@/components/ProgressBar';

export default function DatesStep() {
    const router = useRouter();
    const { tripData, updateTripData } = useTripPlanner();
    const [startDate, setStartDate] = useState(tripData.startDate ? new Date(tripData.startDate) : null);
    const [endDate, setEndDate] = useState(tripData.endDate ? new Date(tripData.endDate) : null);
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }
        if (endDate < startDate) {
            setError('End date cannot be before start date');
            return;
        }
        updateTripData('startDate', startDate.toISOString());
        updateTripData('endDate', endDate.toISOString());
        router.push('/planner/location');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#fff8f0] py-12"
        >
            <div className="max-w-4xl mx-auto px-4">
                <ProgressBar currentStep="dates" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CalendarIcon className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#377c68] mb-4">
                            When do you want to travel?
                        </h1>
                        <p className="text-lg text-[#4ba46c]">
                            Pick your travel dates
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#377c68]">
                                    Start Date
                                </label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setError('');
                                    }}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={new Date()}
                                    placeholderText="Select start date"
                                    className="w-[200px] px-4 py-3 rounded-lg border border-[#4ba46c]/30 focus:outline-none focus:ring-2 focus:ring-[#f3a034] bg-white text-[#377c68] text-left"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[#377c68]">
                                    End Date
                                </label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setError('');
                                    }}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate || new Date()}
                                    placeholderText="Select end date"
                                    className="w-[200px] px-4 py-3 rounded-lg border border-[#4ba46c]/30 focus:outline-none focus:ring-2 focus:ring-[#f3a034] bg-white text-[#377c68] text-left"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <div className="flex justify-center gap-4 pt-4">
                            <motion.button
                                onClick={() => router.push('/planner/name')}
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