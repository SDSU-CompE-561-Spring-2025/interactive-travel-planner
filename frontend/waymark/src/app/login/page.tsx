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
    const [registerUsernameError, setRegisterUsernameError] = useState<string | null>(null);
    const [registerEmailError, setRegisterEmailError] = useState<string | null>(null);
    const [registerPasswordError, setRegisterPasswordError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
        } catch (error: any) {
            let errorMsg = 'Login failed. Please try again.';
            if (error?.response?.data?.detail) {
                errorMsg = error.response.data.detail;
            } else if (Array.isArray(error?.response?.data)) {
                errorMsg = error.response.data.map((e: any) => e.msg).join(', ');
            } else if (typeof error?.response?.data === 'object' && error?.response?.data?.msg) {
                errorMsg = error.response.data.msg;
            }
            setError(errorMsg);
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
            let errorMsg = 'Registration failed. Please try again.';
            if (error?.response?.data?.detail) {
                errorMsg = error.response.data.detail;
            } else if (Array.isArray(error?.response?.data)) {
                errorMsg = error.response.data.map((e: any) => e.msg).join(', ');
            } else if (typeof error?.response?.data === 'object' && error?.response?.data?.msg) {
                errorMsg = error.response.data.msg;
            }
            setError(errorMsg);
        }
    }

    // Validation functions
    const validateUsername = (value: string) => {
        if (!/^[a-zA-Z0-9_]{3,50}$/.test(value)) {
            return "Username must be 3-50 characters, letters, numbers, or underscores only.";
        }
        return null;
    };
    const validateEmail = (value: string) => {
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            return "Invalid email address.";
        }
        return null;
    };
    const validatePassword = (value: string) => {
        if (value.length < 8 || value.length > 64) {
            return "Password must be 8-64 characters.";
        }
        return null;
    };

    // Handlers for real-time validation
    const handleRegisterUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterUsername(e.target.value);
        setRegisterUsernameError(validateUsername(e.target.value));
    };
    const handleRegisterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterEmail(e.target.value);
        setRegisterEmailError(validateEmail(e.target.value));
    };
    const handleRegisterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterPassword(e.target.value);
        setRegisterPasswordError(validatePassword(e.target.value));
    };

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
                                    onChange={handleRegisterUsernameChange}
                                    required
                                />
                                {registerUsernameError && <div className="text-red-500 text-xs mt-1">{registerUsernameError}</div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerEmail">Email</Label>
                                <Input
                                    id="registerEmail"
                                    type="email"
                                    value={registerEmail}
                                    onChange={handleRegisterEmailChange}
                                    required
                                />
                                {registerEmailError && <div className="text-red-500 text-xs mt-1">{registerEmailError}</div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registerPassword">Password</Label>
                                <Input
                                    id="registerPassword"
                                    type="password"
                                    value={registerPassword}
                                    onChange={handleRegisterPasswordChange}
                                    required
                                />
                                {registerPasswordError && <div className="text-red-500 text-xs mt-1">{registerPasswordError}</div>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowRegister(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!!registerUsernameError || !!registerEmailError || !!registerPasswordError || !registerUsername || !registerEmail || !registerPassword}>
                                    Register
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
