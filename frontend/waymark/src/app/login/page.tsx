"use client";

import { useContext, useState, FormEvent } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showRegister, setShowRegister] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
        } catch (error: any) {
            setError(error?.response?.data?.detail || 'Login failed. Please try again.');
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/auth', {
                username: registerUsername,
                password: registerPassword,
                email: registerEmail
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 201) {
                await login(registerUsername, registerPassword);
            }
        } catch(error: any) {
            setError(error?.response?.data?.detail || 'Registration failed. Please try again.');
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-600">Don't have an account?{' '}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline font-medium"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Create one!
                                </button>
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Register Modal */}
            {showRegister && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                        <button className="absolute top-2 right-2 text-gray-400" onClick={() => setShowRegister(false)}>✕</button>
                        <h2 className="text-xl font-bold mb-4">Register</h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="registerUsername">Username</Label>
                                <Input
                                    id="registerUsername"
                                    type="text"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerEmail">Email</Label>
                                <Input
                                    id="registerEmail"
                                    type="email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerPassword">Password</Label>
                                <Input
                                    id="registerPassword"
                                    type="password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowRegister(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Register</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
