import Link from 'next/link';

const trips = [
  {
    id: 1,
    name: 'Paris Getaway',
    destination: 'Paris, France',
    start_date: '2025-06-01',
    end_date: '2025-06-07',
    image: '/images/paris.jpg',
  },
  {
    id: 2,
    name: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    start_date: '2025-07-10',
    end_date: '2025-07-20',
    image: '/images/tokyo.jpg',
  },
  // Add more trips as needed
];

export default function TripsPage() {
  return (
    <main className="bg-gray-50 min-h-screen p-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Explore Your Trips</h1>
        <p className="text-gray-600 mt-4">Discover and manage your upcoming adventures.</p>
      </section>

      {/* Trips Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Link key={trip.id} href={`/trips/${trip.id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img
                src={trip.image}
                alt={trip.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{trip.name}</h2>
                <p className="text-gray-600">{trip.destination}</p>
                <p className="text-sm text-gray-500">
                  {trip.start_date} - {trip.end_date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
