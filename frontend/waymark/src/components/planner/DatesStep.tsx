'use client';

import { useRouter } from 'next/navigation';  
import { usePlannerStore } from '@/store/plannerStore';
import { useState } from 'react';

export default function DatesStep() {
  const router = useRouter();
  const { dates, setField } = usePlannerStore();
  const [startDate, setStartDate] = useState(dates.start);
  const [endDate, setEndDate] = useState(dates.end);

  const handleNext = () => {
    setField('dates', { start: startDate, end: endDate });
    router.push('/planner/destination');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">When do you wanna go on the trip?</h1>

      <label className="mb-2">Start Date</label>
      <input
        type="date"
        className="border p-2 rounded mb-4"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label className="mb-2">End Date</label>
      <input
        type="date"
        className="border p-2 rounded mb-4"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button
        onClick={handleNext}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Next Step
      </button>
    </div>
  );
}
