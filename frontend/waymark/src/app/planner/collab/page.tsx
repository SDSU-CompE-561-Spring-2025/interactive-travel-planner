'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Plus, X, Mail, Users } from 'lucide-react';

export default function CollaboratorsStep() {
    const router = useRouter();
    const { tripData, updateTripData } = useTripPlanner();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleAddCollaborator = () => {
        if (!email.trim()) {
            setError('Please enter an email address');
            return;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }

        const currentCollaborators = tripData.collaborators || [];
        if (currentCollaborators.includes(email)) {
            setError('This email has already been added');
            return;
        }

        updateTripData('collaborators', [...currentCollaborators, email]);
        setEmail('');
        setError('');
    };

    const handleRemoveCollaborator = (emailToRemove: string) => {
        const currentCollaborators = tripData.collaborators || [];
        updateTripData(
            'collaborators',
            currentCollaborators.filter(email => email !== emailToRemove)
        );
    };

    const handleNext = () => {
        router.push('/planner/review');
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
                            <Users className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <motion.h1 
                            className="text-4xl font-bold mb-4 text-[#377c68]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Invite friends to plan together!
                        </motion.h1>
                        <p className="text-lg text-[#4ba46c]">
                            Add collaborators to your trip
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#377c68]" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Enter email address"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#377c68]/20 focus:ring-2 focus:ring-[#f3a034] focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <motion.button
                                    onClick={handleAddCollaborator}
                                    className="bg-[#f3a034] text-white p-3 rounded-lg hover:bg-[#f3a034]/90 transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus size={20} />
                                </motion.button>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}

                            <div className="space-y-2">
                                {(tripData.collaborators || []).map((collaborator, index) => (
                                    <motion.div
                                        key={collaborator}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-[#377c68]/10"
                                    >
                                        <span className="text-[#377c68]">{collaborator}</span>
                                        <button
                                            onClick={() => handleRemoveCollaborator(collaborator)}
                                            className="text-[#377c68]/60 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <X size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-sm text-[#377c68]/70 text-center mt-4">
                                Your friends will receive an email invitation to collaborate on this trip.
                            </p>
                        </motion.div>

                        <div className="flex justify-center gap-4 mt-8">
                            <motion.button
                                onClick={() => router.push('/planner/budget')}
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