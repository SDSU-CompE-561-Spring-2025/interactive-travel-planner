'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlaneTakeoff } from 'lucide-react';
import { ProgressBar } from '@/components/ProgressBar';

export default function StartStep() {
    const router = useRouter();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#fff8f0] py-12"
        >
            <div className="max-w-4xl mx-auto px-4">
                <ProgressBar currentStep="start" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md mx-auto text-center"
                >
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PlaneTakeoff className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#377c68] mb-4">
                            Ready to plan your adventure?
                        </h1>
                        <p className="text-lg text-[#4ba46c] max-w-md mx-auto">
                            Let's create your perfect trip itinerary together, step by step.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/planner/name')}
                        className="bg-[#f3a034] text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg hover:bg-[#f3a034]/90 transition-colors duration-200"
                    >
                        Start Planning
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
} 