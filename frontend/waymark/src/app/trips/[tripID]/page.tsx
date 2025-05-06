import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        {/* 📷 Image Banner */}
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
          {trip.destination}
        </div>

        <div className="p-6 space-y-6">
          {/* 🔙 Back Link */}
          <Link href="/trips" className="text-blue-600 hover:underline text-sm inline-block">
            ← Back to All Trips
          </Link>

          {/* 🧭 Trip Info */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
            <p className="text-lg text-gray-700">📍 {trip.destination}</p>
            <p className="text-sm text-gray-500">
              📅 {trip.start_date} → {trip.end_date}
            </p>
          </div>

          {/* 💬 Placeholder Section */}
          <div className="rounded-lg border p-4 bg-gray-50 text-sm text-gray-400 italic">
            More trip features coming soon...
          </div>
        </div>
      </div>
    </main>
  );
}
