// ✅ Full DatesStep.tsx (Zustand only)

'use client';

import { useRouter } from 'next/navigation';
import { usePlannerStore } from '@/store/plannerStore';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format, isBefore } from 'date-fns';

export default function DatesStep() {
  const router = useRouter();
  const { dates, setField, returnToReview } = usePlannerStore();

  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: dates.start ? new Date(dates.start) : undefined,
    to: dates.end ? new Date(dates.end) : undefined,
  });

  const [error, setError] = useState('');

  const handleNext = () => {
    if (!range.from || !range.to) {
      setError('Please select both start and end dates.');
      return;
    }

    if (isBefore(range.to, range.from)) {
      setError('End date cannot be before start date.');
      return;
    }

    const start = range.from.toISOString().split('T')[0];
    const end = range.to.toISOString().split('T')[0];

    setField('dates', { start, end });

    if (returnToReview) {
      setField('returnToReview', false);
      router.push('/planner/review');
    } else {
      router.push('/planner/destination');
    }
  };

  const handleBack = () => router.back();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        When do you wanna go on the trip?
      </h1>

      <div className="w-full max-w-md">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          className="rounded-md border shadow mb-4"
          disabled={(date) => date < new Date()}
        />

        <p className="text-sm text-gray-600 mb-4">
          {range.from && range.to
            ? `Selected: ${format(range.from, 'MMM dd')} → ${format(range.to, 'MMM dd')}`
            : 'Please select a start and end date'}
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <div className="flex gap-4 justify-center">
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
    </div>
  );
}
