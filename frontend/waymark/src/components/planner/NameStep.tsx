'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';  

export default function NameStep() {
    const router = useRouter();
    const tripId = useId();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Let's name your trip!</h1>

        <label htmlFor={tripId}>Trip Name</label>
        <input 
            id={tripId} 
            type="text" 
            required 
            placeholder="Enter creative name here" 
            className="border p-2 rounded mb-4"
        />

        <button
            onClick={() => router.push('/planner/dates')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
            Next Step
        </button> 
    </div>
  );
}