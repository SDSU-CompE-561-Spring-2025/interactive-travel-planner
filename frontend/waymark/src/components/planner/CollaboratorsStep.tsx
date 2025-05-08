'use client';

import { useRouter } from 'next/navigation';
import { usePlannerStore } from '@/store/plannerStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PlannerLayout from './PlannerLayout';

export default function CollaboratorsStep() {
  const router = useRouter();
  const { collaborators, setField } = usePlannerStore();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ name: string; id: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!search.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/users/search?query=${search}`);
      const data = await res.json(); // [{ id: 'abc', name: 'Jane Doe' }, ...]
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCollaborator = (user: { id: string; name: string }) => {
    const alreadyAdded = collaborators.some((c) => c.id === user.id);
    if (!alreadyAdded) {
      setField('collaborators', [...collaborators, user]);
    }
    setSearch('');
    setResults([]);
  };
  

  return (
    <PlannerLayout currentStep={6}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-6">Invite your friends to plan!</h1>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
              className="border p-2 rounded w-full"
            />
            <button onClick={searchUsers} className="bg-blue-500 text-white px-4 rounded">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {results.length > 0 && (
            <ul className="border rounded p-2 mb-4">
              {results.map((user) => (
                <li key={user.id} className="flex justify-between items-center py-1">
                  <span>{user.name}</span>
                    <button
                        onClick={() => addCollaborator(user)}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                        >
                        Add
                    </button>
                </li>
              ))}
            </ul>
          )}

        <h2 className="text-lg font-semibold mb-2">Selected Collaborators:</h2>
        <ul className="list-disc pl-5 mb-6">
        {collaborators.map((c) => (
            <li key={c.id} className="flex items-center justify-between text-sm text-gray-700 mb-1">
            {c.name}
            <button
                onClick={() =>
                setField('collaborators', collaborators.filter((x) => x.id !== c.id))
                }
                className="text-red-500 text-xs ml-4"
            >
                Remove
            </button>
            </li>
        ))}
        </ul>



          <button
            onClick={() => router.push('/planner/review')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Next Step
          </button>
        </div>
      </motion.div>
    </PlannerLayout>
    
  );
}
