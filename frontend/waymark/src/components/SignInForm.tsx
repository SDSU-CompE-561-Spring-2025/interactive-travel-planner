'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface AuthResponse {
    access_token: string;
    token_type: string;
}

export default function SignInForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Convert form data to URLSearchParams for OAuth2 password flow
            const params = new URLSearchParams();
            params.append('username', formData.username);
            params.append('password', formData.password);

            const response = await axios.post<AuthResponse>('/auth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Store the token in localStorage
            localStorage.setItem('token', response.data.access_token);
            
            // Set the token in axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            
            toast.success('Successfully signed in!');
            // Redirect to the dashboard
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.detail || 'Failed to sign in. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
} 