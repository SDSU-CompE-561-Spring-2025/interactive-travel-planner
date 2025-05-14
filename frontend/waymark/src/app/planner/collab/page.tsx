'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { Plus, X, Mail, Users } from 'lucide-react';
import axios from '@/lib/axios';

export default function CollaboratorsStep() {
    const router = useRouter();
    const { tripData, updateTripData } = useTripPlanner();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState('');
    let searchTimeout: NodeJS.Timeout | null = null;

    // Search for users by username
    const handleSearch = (value: string) => {
        setSearch(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        if (!value.trim() || value.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        searchTimeout = setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/users/search?query=${encodeURIComponent(value)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter out already-added collaborators
                const filteredResults = Array.isArray(res.data)
                    ? res.data.filter((user: any) => !(tripData.collaborators || []).includes(user.username))
                    : [];
                setSearchResults(filteredResults);
            } catch (e) {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
    };

    const handleAddCollaborator = (username: string) => {
        const currentCollaborators = tripData.collaborators || [];
        if (currentCollaborators.includes(username)) {
            setError('This user has already been added');
            return;
        }
        updateTripData('collaborators', [...currentCollaborators, username]);
        setSearch('');
        setSearchResults([]);
        setError('');
    };

    const handleRemoveCollaborator = (usernameToRemove: string) => {
        const currentCollaborators = tripData.collaborators || [];
        updateTripData(
            'collaborators',
            currentCollaborators.filter(username => username !== usernameToRemove)
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
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => { setSearch(e.target.value); setError(''); handleSearch(e.target.value); }}
                                        placeholder="Type a username..."
                                        className="w-full pl-4 pr-4 py-3 rounded-lg border border-[#377c68]/20 focus:ring-2 focus:ring-[#f3a034] focus:border-transparent transition-all duration-200"
                                    />
                                    {search && searchResults.length > 0 && (
                                        <ul className="absolute z-10 w-full border rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto mt-1">
                                            {searchResults.map((user: any) => (
                                                <li
                                                    key={user.id}
                                                    className="px-4 py-3 hover:bg-[#f3a034]/10 cursor-pointer border-b last:border-0 transition-colors"
                                                    onClick={() => handleAddCollaborator(user.username)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-[#377c68] text-white flex items-center justify-center text-sm font-medium">
                                                            {user.username.substring(0, 1).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="font-medium text-[#377c68]">{user.username}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {search && !searchLoading && searchResults.length === 0 && (
                                        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 px-4 py-2 text-sm text-gray-500">No users found matching "{search}"</div>
                                    )}
                                    {searchLoading && (
                                        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 px-4 py-2 text-sm text-gray-400">Searching...</div>
                                    )}
                                </div>
                                <motion.button
                                    onClick={() => search && searchResults.length > 0 && handleAddCollaborator(searchResults[0].username)}
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
                                Your friends will receive an invitation to collaborate on this trip.
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
