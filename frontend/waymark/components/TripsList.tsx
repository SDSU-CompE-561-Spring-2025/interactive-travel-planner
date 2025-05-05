'use client';

import { useEffect, useState } from 'react';

type Trip = {
    id: number;
    name: string;
    destination: string;
    start_date: string;
    end_date: string;
};

export default function TripList() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/trips')
            .then((res) => res.json())
            .then((data) => {
                setTrips(data);
                setLoading(false);
            });
},  []);

if (loading) return <p>Loading trips...</p>;

return (
    <div className="space-y-4">
        {trips.map((trip) => (
            <div key={trip.id} className="border p-4 rounded shadow">
                <h2 className="text-xl fond-bold">{trip.name}</h2>
                <p>📍 {trip.destination}</p>
                <p>📅 {trip.start_date} → {trip.end_date}</p>
            </div>
        ))}
    </div>
    );
}
