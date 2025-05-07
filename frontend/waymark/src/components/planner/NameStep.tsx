'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { usePlannerStore } from '@/store/plannerStore';
import { useState } from 'react';

export default function NameStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnToReview = searchParams.get('return') === 'true';

  const { tripName, setField } = usePlannerStore();
  const [name, setName] = useState(tripName);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!name.trim()) {
      setError('Name your trip!');
      return;
    }

    setField('tripName', name);
    if (returnToReview) {
      router.push('/planner/review');
    } else {
      router.push('/planner/dates');
    }
  };

  const handleBack = () => router.back();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold mb-4">Let's name your trip!</h1>

      <label htmlFor="tripNameInput" className="mb-1 font-medium">Trip Name</label>
      <input
        id="tripNameInput"
        type="text"
        placeholder={tripName || 'Enter creative name here'}
        className="border p-2 rounded mb-2 w-full max-w-md"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {returnToReview ? 'Return to Review' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
