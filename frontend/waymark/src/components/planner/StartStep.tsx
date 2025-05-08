'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PlannerLayout from './PlannerLayout';

export default function StartStep() {
  const router = useRouter();

  return (
    <PlannerLayout currentStep={0}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-6">Ready to plan your adventure?</h1>
        <p className="text-gray-600 mb-6">
          We'll guide you step-by-step through your perfect trip.
        </p>
        <button
          onClick={() => router.push('/planner/name')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Start Planning
        </button>
      </motion.div>
    </PlannerLayout>
  );
}
