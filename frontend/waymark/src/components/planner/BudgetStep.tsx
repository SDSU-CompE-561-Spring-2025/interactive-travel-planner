'use client';

import { useRouter } from 'next/navigation';  

export default function BudgetStep() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Let's choose the budget</h1>
        <button
            onClick={() => router.push('/planner/review')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
        Next step
      </button>
    </div>
  );
}