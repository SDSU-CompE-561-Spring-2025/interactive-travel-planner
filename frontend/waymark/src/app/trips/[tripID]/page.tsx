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
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{trip.name}</h1>
      <p className="text-lg text-gray-700">📍 Destination: {trip.destination}</p>
      <p className="text-sm text-gray-500 mb-6">
        📅 {trip.start_date} → {trip.end_date}
      </p>
    </main>
  );
}
