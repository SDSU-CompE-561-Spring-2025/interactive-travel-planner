'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, MapPin } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    location: string | null;
    bio: string | null;
}

export default function ProfileSettings() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        location: '',
        bio: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get<UserProfile>('/users/me');
            setProfile(response.data);
            setFormData(prev => ({
                ...prev,
                username: response.data.username,
                email: response.data.email,
                location: response.data.location || '',
                bio: response.data.bio || ''
            }));
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            // Validate password fields if attempting to change password
            if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error('New passwords do not match');
                    return;
                }
                if (!formData.currentPassword) {
                    toast.error('Current password is required to change password');
                    return;
                }
            }

            const updateData = {
                username: formData.username,
                email: formData.email,
                location: formData.location || null,
                bio: formData.bio || null,
                ...(formData.newPassword && {
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword
                })
            };

            await axios.put('/users/me', updateData);

            toast.success('Profile updated successfully');
            
            // Clear password fields after successful update
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3a034]"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#fff8f0] py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="mb-8">
                        <Link 
                            href="/dashboard"
                            className="text-[#377c68] hover:text-[#377c68]/80 flex items-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#377c68]/10">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-[#f3a034]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#377c68]">Profile Settings</h1>
                                    <p className="text-[#4ba46c]">Manage your account details</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="username" className="text-[#377c68]">Username</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#377c68]/40" />
                                            <Input
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="pl-10 border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-[#377c68]">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#377c68]/40" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-10 border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="location" className="text-[#377c68]">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#377c68]/40" />
                                            <Input
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="City, Country"
                                                className="pl-10 border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="bio" className="text-[#377c68]">Bio</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2 h-5 w-5 text-[#377c68]/40" />
                                            <textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                placeholder="Tell us about yourself..."
                                                className="w-full pl-10 py-2 border rounded-md border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034] min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#377c68]/10 pt-6">
                                    <h2 className="text-xl font-semibold text-[#377c68] mb-4">Change Password</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="currentPassword" className="text-[#377c68]">Current Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#377c68]/40" />
                                                <Input
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type="password"
                                                    value={formData.currentPassword}
                                                    onChange={handleChange}
                                                    className="pl-10 border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="newPassword" className="text-[#377c68]">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#377c68]/40" />
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className="pl-10 border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPassword" className="text-[#377c68]">Confirm New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#377c68]/40" />
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="pl-10 border-[#377c68]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-[#f3a034] hover:bg-[#f3a034]/90 text-white px-8"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 