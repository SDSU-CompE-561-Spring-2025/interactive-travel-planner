'use client';
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

import React, { useState, FormEvent } from 'react';

// Use environment variable or fallback to localhost
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface TokenResponse {
    access_token: string;
    token_type: string;
    }

    export default function SignInForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await axios.post<TokenResponse>(
                `${API_URL}/auth/token`,
                formData,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const { access_token, token_type } = response.data;
        // Store JWT in localStorage (or cookie) for authenticated requests
        localStorage.setItem('jwt', access_token);
        // Optionally store token_type
        router.push('/');
        } catch (error: any) {
        if (error.isAxiosError) {
            const detail = error.response?.data?.detail;
            setError(detail ?? 'Unable to log in.');
        } else {
            setError('An unexpected error occurred.');
        }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
        <h2 className="text-xl font-semibold">Sign In</h2>
        {error && <div className="text-red-500">{error}</div>}
        <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
            />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Log In
        </button>
        </form>
    );
}





/*
export default function SignInForm() {

    return (
        <div className="rounded-lg border bg-background p-4 shadow-sm">
            <h1>Sign In</h1>
            <form>
                <div className = "mb-4">
                    <label htmlFor="username">Username:</label>
                    <input className="bg-amber-50"
                        type="username"
                        id="username"
                        name="username"
                        required
                        />
                </div>
                <div className = "mb-4">
                    <label htmlFor="password">Password:</label>
                    <input className ="bg-amber-50"
                        type="password"
                        id="password"
                        name="password"
                        required
                        />
                </div>

                <div className="p-5 bg-amber-300">
                    <button className="bg-amber-300 hover:bg-amber-300 text-white font-bold py-2 px-4 rounded"
                    type="submit"> Sign In</button>
                </div>
            </form>
        </div>
    );
}
*/
