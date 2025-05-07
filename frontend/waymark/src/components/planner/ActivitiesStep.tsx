'use client';

import { useRouter } from 'next/navigation';  
import { motion } from 'framer-motion';
import PlannerLayout from './PlannerLayout';

export default function ActivitiesStep() {
  const router = useRouter();

  return (
    <PlannerLayout currentStep={4}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">What kind of activities do you wanna do?</h1>
            <button
                onClick={() => router.push('/planner/budget')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
            Next step
          </button>
        </div>
      </motion.div>
    </PlannerLayout>
        
  );
}