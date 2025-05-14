'use client';

import { useContext, useState, FormEvent } from "react";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Register() {
    const { signup } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }
            if (name.length < 2) {
                throw new Error("Name must be at least 2 characters long");
            }
            await signup(email, password, name);
        } catch(error: any) {
            setError(error?.response?.data?.detail || error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fff8f0] py-12">
            <div className="container max-w-md">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card className="border-[#4ba46c]/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-[#377c68]">Create Account</CardTitle>
                        <CardDescription>Sign up for a new account to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[#377c68]">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-[#4ba46c]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                    placeholder="Enter your full name"
                                    required
                                    minLength={2}
                                    maxLength={50}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#377c68]">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-[#4ba46c]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[#377c68]">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-[#4ba46c]/20 focus:border-[#f3a034] focus:ring-[#f3a034]"
                                    placeholder="Choose a password (min. 8 characters)"
                                    required
                                    minLength={8}
                                    maxLength={64}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-[#4ba46c] hover:bg-[#4ba46c]/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#f3a034] hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 