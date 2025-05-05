'use client';

import TripsList from '../../../components/TripsList';

export default function TripsPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Trips</h1>
      <TripsList />
    </main>
  );
}