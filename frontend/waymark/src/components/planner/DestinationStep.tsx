// ✅ Full DestinationStep.tsx (Zustand only with Back + Review logic)

'use client';

import { useRouter, useSearchParams } from 'next/navigation';  
import { useState } from 'react';
import { motion } from 'framer-motion';
import PlannerLayout from './PlannerLayout';
import { usePlannerStore } from '@/store/plannerStore';

const CITY_SUGGESTIONS = [
  'New York', 'Los Angeles', 'London', 'Paris', 'Tokyo', 'Barcelona', 'Rome',
  'Sydney', 'Berlin', 'Toronto', 'San Francisco', 'Singapore', 'Dubai', 'Amsterdam', 'Jakarta', 'Okinawa',
  'Ho Chi Minh City', 'Seattle', 'San Diego', 'Osaka', 'Niger'
];

export default function DestinationStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnToReview = searchParams.get('return') === 'true';

  const { destination, setField } = usePlannerStore();
  const [name, setName] = useState(destination);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    setName(value);
    if (value.length > 0) {
      const matches = CITY_SUGGESTIONS.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5)); // limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (city: string) => {
    setName(city);
    setSuggestions([]);
  };

  const handleNext = () => {
    if (!name.trim()) {
      setError('Please enter a destination.');
      return;
    }

    setField('destination', name);
    if (returnToReview) {
      router.push('/planner/review');
    } else {
      router.push('/planner/budget');  //chnage to activities
    }
  };

  const handleBack = () => router.back();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold mb-4">Where do you wanna go?</h1>

      <div className="w-full max-w-md relative">
        <input
          type="text"
          className='border p-2 rounded w-full mb-2'
          value={name}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={destination || 'Enter a destination'}
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow z-10">
            {suggestions.map((city) => (
              <li
                key={city}
                onClick={() => handleSelectSuggestion(city)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex gap-4 justify-center mt-2">
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
