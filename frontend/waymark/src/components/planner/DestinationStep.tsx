'use client';

import { useRouter } from 'next/navigation';  
import { useState } from 'react';
import { usePlannerStore } from '@/store/plannerStore';

export default function DestinationStep() {
  const router = useRouter();
  const { destination, setField} = usePlannerStore();
  const [name, setName] = useState(destination)

  const handleNext = () => {
    setField(destination, name);
    router.push('/planner/activities');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Where do you wanna go</h1>
        <input 
          type="text" 
          className='border p-2 rounded w-full mb-4' 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
        <button
            onClick={ handleNext }
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
        Next step
      </button>
    </div>
  );
}