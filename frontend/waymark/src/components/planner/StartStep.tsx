// src/components/planner/StartStep.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function StartStep() {
  const router = useRouter();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Ready to plan your adventure?</h1>
      <button
        onClick={() => router.push('/planner/name')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Start Planning
      </button>
    </div>
  );
}
