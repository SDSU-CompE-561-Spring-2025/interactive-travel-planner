'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Plus, X, Mail } from 'lucide-react';

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
            className="flex flex-col items-center justify-center min-h-[80vh]"
        >
            <motion.h1 
                className="text-4xl font-bold mb-8 text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Invite friends to plan together!
            </motion.h1>

            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter email address"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <motion.button
                            onClick={handleAddCollaborator}
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <span className="text-gray-700">{collaborator}</span>
                                <button
                                    onClick={() => handleRemoveCollaborator(collaborator)}
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                >
                                    <X size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 text-center mt-4">
                        Your friends will receive an email invitation to collaborate on this trip.
                    </p>
                </motion.div>

                <div className="flex justify-between gap-4 mt-8">
                    <motion.button
                        onClick={() => router.push('/planner/budget')}
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