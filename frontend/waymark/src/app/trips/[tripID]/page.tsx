import { notFound } from 'next/navigation';

type Trip = {
  id: number;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
};

async function getTrip(tripId: string): Promise<Trip | null> {
  try {
    const res = await fetch(`http://localhost:8000/trips/${tripId}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function TripDetailPage({ params }: { params: { tripId: string } }) {
  const trip = await getTrip(params.tripId);

  if (!trip) return notFound();

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{trip.name}</h1>
        <p className="text-gray-700 text-lg">📍 {trip.destination}</p>
        <p className="text-sm text-gray-500">📅 {trip.start_date} → {trip.end_date}</p>
      </div>
  
      {/* Placeholder for future sections */}
      <div className="border rounded-lg p-4 shadow-sm">
        <p className="text-sm text-gray-400 italic">More trip features coming soon...</p>
      </div>
    </main>
  );  
}
