'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Trip = {
  id: number;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
};

export default function TripsList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/trips')
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading trips...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="border p-4 rounded shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">{trip.name}</h2>
          <p className="text-gray-600">{trip.destination}</p>
          <p className="text-sm text-gray-500">
            {trip.start_date} → {trip.end_date}
          </p>
        </div>
      ))}
    </div>
  );
}
