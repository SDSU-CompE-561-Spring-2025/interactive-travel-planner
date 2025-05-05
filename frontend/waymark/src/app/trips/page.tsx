'use client';

import { useState } from 'react';
import NewTripForm from '@/components/NewTripForm';
import TripsList from '@/components/TripsList';

export default function TripsPage() {
    const [refreshKey, setRefreshKey] = useState(0); // used to re-render TripsList on new trip

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">My Trips</h1>
            <NewTripForm onTripCreated={() => setRefreshKey((k) => k + 1)} />
            <TripsList key={refreshKey} />
        </main>
    );
}
