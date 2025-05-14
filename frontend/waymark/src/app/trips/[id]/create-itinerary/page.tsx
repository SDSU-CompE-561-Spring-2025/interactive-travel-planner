'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CreateItineraryForm {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
}

export default function CreateItineraryPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateItineraryForm>({
        name: '',
        description: '',
        start_date: '',
        end_date: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            await axios.post(
                `http://localhost:8000/trips/${params.id}/itineraries`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success('Itinerary created successfully!');
            router.push(`/trips/${params.id}`);
        } catch (error) {
            console.error('Failed to create itinerary:', error);
            toast.error('Failed to create itinerary');
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#fff8f0]">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Link 
                            href={`/trips/${params.id}`}
                            className="text-[#377c68] hover:text-[#377c68]/80 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to Trip
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-3xl font-bold text-[#377c68] mb-6">Create New Itinerary</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Itinerary Name
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter itinerary name"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your itinerary plans..."
                                    className="w-full min-h-[100px] resize-y"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-[#f3a034] text-white hover:bg-[#f3a034]/90"
                                >
                                    Create Itinerary
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 