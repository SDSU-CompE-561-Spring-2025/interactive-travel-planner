'use client';

import { useRouter } from 'next/navigation';  

export default function ReviewStep() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Review your trip!</h1>
        <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
        Done!
      </button>
    </div>
  );
}