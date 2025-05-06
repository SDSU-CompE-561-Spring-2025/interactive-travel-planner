'use client';

import { useRouter } from 'next/navigation';  
import { Slider } from '../ui/slider'; // or '@/components/ui/slider'
import { usePlannerStore } from '@/store/plannerStore';
import { useState } from 'react';

export default function BudgetStep() {
  const router = useRouter();
  const { budget, setField } = usePlannerStore();
  const [value, setValue] = useState([Number(budget) || 1000]);

  const handleNext = () => {
    setField('budget', value[0].toString()); // Store as string if that's your schema
    router.push('/planner/collab');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Let's choose the budget</h1>

      <div className="w-3/4 mb-4">
        <Slider
          min={100}
          max={10000}
          step={50}
          value={value}
          onValueChange={(val) => setValue(val)}
        />
        <div className="mt-2 text-center text-sm text-gray-700">
          Selected budget: ${value[0]}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Next step
      </button>
    </div>
  );
}
