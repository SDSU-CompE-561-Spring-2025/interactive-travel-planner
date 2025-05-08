// ✅ Full BudgetStep.tsx (Zustand only with Back + Review logic + Required validation)

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '../ui/slider';
import { usePlannerStore } from '@/store/plannerStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PlannerLayout from './PlannerLayout';

export default function BudgetStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnToReview = searchParams.get('return') === 'true';

  const { budget, setField } = usePlannerStore();
  const [value, setValue] = useState([Number(budget) || 0]);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (value[0] < 100) {
      setError('Please select a budget of at least $100.');
      return;
    }

    setField('budget', value[0].toString());
    if (returnToReview) {
      router.push('/planner/review');
    } else {
      router.push('/planner/collab');
    }
  };

  const handleBack = () => router.back();

  return (
    <PlannerLayout currentStep={5}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">Let's choose the budget</h1>

          <div className="w-full max-w-md mb-4">
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
            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
          </div>

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
      </motion.div>
    </PlannerLayout>
    
  );
}
