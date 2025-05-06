'use client';

import { useRouter } from 'next/navigation';
import { usePlannerStore } from '@/store/plannerStore';

export default function ReviewStep() {
  const router = useRouter();
  const {
    tripName,
    budget,
    activities,
    destination,
    dates,
    collaborators,
  } = usePlannerStore();

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:8000/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trip_name: tripName,
        budget,
        activities,
        destination,
        start_date: dates.start,
        end_date: dates.end,
        collaborators: collaborators.map((c) => c.id),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/trips/${data.id}`);
    } else {
      alert('Failed to create trip');
    }
  };

  const Item = ({
    label,
    value,
    editRoute,
  }: {
    label: string;
    value: React.ReactNode;
    editRoute: string;
  }) => (
    <div className="flex items-start justify-between border-b pb-2 mb-3">
      <div>
        <p className="font-semibold">{label}</p>
        <div className="text-gray-800 text-sm">{value}</div>
      </div>
      <button
        className="text-sm text-blue-600 underline ml-4"
        onClick={() => router.push(`/planner/${editRoute}?return=true`)}
      >
        Edit
      </button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Review Your Trip</h1>

      <div className="space-y-3">
        <Item label="🏷️ Trip Name" value={tripName || 'Not set'} editRoute="name" />
        <Item label="💸 Budget" value={budget ? `$${budget}` : 'Not set'} editRoute="budget" />
        <Item
          label="🎯 Activities"
          value={activities.length > 0 ? activities.join(', ') : 'None selected'}
          editRoute="activities"
        />
        <Item
          label="📍 Destination"
          value={destination || 'Not chosen'}
          editRoute="destination"
        />
        <Item
          label="📅 Dates"
          value={
            dates.start && dates.end
              ? `${dates.start} → ${dates.end}`
              : 'Not selected'
          }
          editRoute="dates"
        />
        <Item
          label="🧑‍🤝‍🧑 Collaborators"
          value={
            collaborators.length > 0 ? (
              <ul className="list-disc ml-5">
                {collaborators.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            ) : (
              'None'
            )
          }
          editRoute="collab"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Confirm and Create Trip
      </button>
    </div>
  );
}
