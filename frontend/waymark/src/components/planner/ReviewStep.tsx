'use client';

import { useRouter } from 'next/navigation';
import { usePlannerStore } from '@/store/plannerStore';
import { motion } from 'framer-motion';
import PlannerLayout from './PlannerLayout';

export default function ReviewStep() {
  const router = useRouter();
  const {
    tripName,
    budget,
    activities,
    destination,
    dates,
    collaborators,
    setField,
  } = usePlannerStore();

  // --- Create trip in backend ---
  const handleSubmit = async () => {
    // const userId = useUserStore.getState().user?.id;
    // const userId = 1;
    // if (!userId) {
    //   alert('You must be logged in to create a trip.');
    //   return;
    // }
  
    // // --- Create trip ---
    // const tripPayLoad = {
    //   title: tripName,
    //   start_date: dates.start,
    //   end_date: dates.end,
    // };
  
    // const tripRes = await fetch(`http://localhost:8000/users/${userId}/trips`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(tripPayLoad),
    // });
  
    // if (!tripRes.ok) {
    //   alert('Failed to create trip');
    //   return;
    // }
  
    // const tripData = await tripRes.json();
    // const tripId = tripData.id;
    // setField('tripId', tripId);
  
    // // --- Save Dates ---
    // const datesPayLoad = {
    //   start_date: dates.start,
    //   end_date: dates.end,
    // };

    // const datesRes = await fetch(`http://localhost:8000/trips/${tripId}/dates`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(datesPayLoad),
    // });
  
    // if (!datesRes.ok) {
    //   alert('Failed to save dates');
    //   return;
    // }
  
    // // --- Save Budget (optional endpoint) ---
    // const budgetPayLoad = { amount: budget };
    // const budgetRes = await fetch(`http://localhost:8000/trips/${tripId}/budget`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(budgetPayLoad),
    // });
  
    // if (!budgetRes.ok) {
    //   alert('Failed to save budget');
    //   return;
    // }
  
    // // --- Save Destination ---
    // const destinationPayload = { destination };
    // const destinationRes = await fetch(`http://localhost:8000/trips/${tripId}/destinations`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(destinationPayload),
    // });
  
    // if (!destinationRes.ok) {
    //   alert('Failed to save destination');
    //   return;
    // }
  
    // // --- Save Collaborators ---
    // for (const user of collaborators) {
    //   const res = await fetch(`http://localhost:8000/trips/${tripId}/collaborators`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ user_id: user.id }),
    //   });
  
    //   if (!res.ok) {
    //     alert(`Failed to add collaborator ${user.name}`);
    //     return;
    //   }
    // }
  
    // ✅ Success
    // router.push(`/trips/${tripId}`);
    router.push(`/trips`)
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
    <PlannerLayout currentStep={8}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
         <div className="max-w-xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Review Your Trip</h1>

          <div className="space-y-3">
            <Item label="🏷️ Trip Name" value={tripName || 'Not set'} editRoute="name" />
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
              label="📍 Destination"
              value={destination || 'Not chosen'}
              editRoute="destination"
            />
            <Item
              label="🎯 Activities"
              value={activities.length > 0 ? activities.join(', ') : 'None selected'}
              editRoute="activities"
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
            <Item label="💸 Budget" value={budget ? `$${budget}` : 'Not set'} editRoute="budget" /> 
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Confirm and Create Trip
          </button>
        </div>
      </motion.div>
    </PlannerLayout>
   
  );
}
