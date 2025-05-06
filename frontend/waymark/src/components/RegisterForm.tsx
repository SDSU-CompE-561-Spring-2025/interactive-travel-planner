import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegistorForm() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
        await axios.post('http://localhost:8000/auth/register', {
            username,
            email,
            password,
        });
        navigate('/login');
        } catch (error: any) {
        if (error.isAxiosError) {
            const detail = error.response?.data?.detail;
            setError(detail ?? 'An unexpected error occurred.');
        } else {
            setError('An unexpected error occurred.');
        }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
        <h2 className="text-xl font-semibold">Register</h2>
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
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Sign Up
        </button>
        </form>
    );
}






/*
export default function RegistorForm() {

    return (
        <div className="p-20 m-20">
            <h1>SignUp Page</h1>
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
                    <label htmlFor="email">Email:</label>
                    <input className="bg-amber-50"
                        type="email"
                        id="email"
                        name="email"
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
                <div className = "mb-4">
                    <label htmlFor="confirm password">Confirm Password:</label>
                    <input className ="bg-amber-50"
                        type="confirm password"
                        id="confirm password"
                        name="confirm password"
                        required
                        />
                </div>
                <div className="p-5 bg-amber-300">
                    <button className="bg-amber-300 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded"
                    type="submit"> Sign Up</button>
                </div>
            </form>
        </div>
    );
}
*/
