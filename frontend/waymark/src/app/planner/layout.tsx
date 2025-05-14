'use client';

import { TripPlannerProvider } from '@/contexts/TripPlannerContext';

export default function PlannerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TripPlannerProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-6">
                    {children}
                </div>
            </div>
        </TripPlannerProvider>
    );
} 