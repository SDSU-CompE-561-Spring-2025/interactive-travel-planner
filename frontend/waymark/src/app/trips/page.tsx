'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Trip = {
  id: number;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  image?: string;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('http://localhost:8000/trips', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Unauthorized. Please log in.');
          } else {
            throw new Error('Failed to fetch trips');
          }
        }

        const data = await res.json();
        setTrips(data);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while loading your trips.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Your Trips</h1>
        <p className="text-gray-600 mt-4">Discover and manage your adventures.</p>
      </section>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading your trips...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : trips.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">You don't have any trips yet.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
                <img
                  src={trip.image || 'https://via.placeholder.com/400x250?text=Trip'}
                  alt={trip.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{trip.name}</h2>
                  <p className="text-gray-600">{trip.destination}</p>
                  <p className="text-sm text-gray-500">
                    {trip.start_date} → {trip.end_date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
