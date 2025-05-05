'use client';

import React, { useState } from 'react';

export default function NewTripForm({ onTripCreated }: { onTripCreated: () => void}) {
    const [name, setName] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch('http://localhost:8000/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                destination, 
                start_date: startDate,
                end_date: endDate,
            }),
        });

        setName('');
        setDestination('');
        setStartDate('');
        setEndDate('');
        onTripCreated();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded mb-6 shadow">
            <h2 className="text-xl font-bold">Create New Trip</h2
            
            <input
                type="text"
                placeholder="Trip Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />

            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Add Trip
            </button>
        </form>
    );
}