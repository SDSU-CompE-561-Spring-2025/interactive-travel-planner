'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';

export default function RegisterSuccess() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#fff8f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full border-[#4ba46c]/20 shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-[#4ba46c]" />
                    </div>
                    <CardTitle className="text-2xl text-[#377c68]">Registration Successful!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-600 mb-8">
                        Your account has been created successfully. You can now log in with your email and password.
                    </p>
                    <Button 
                        onClick={() => router.push('/login')}
                        className="w-full bg-[#f3a034] hover:bg-[#f3a034]/90 text-white"
                    >
                        Continue to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 