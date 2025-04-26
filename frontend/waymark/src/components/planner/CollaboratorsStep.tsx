'use client';

import { useRouter } from "next/navigation";

export default function CollaboratorsStep() {
    const router = useRouter();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Invite your friends to plan!</h1>

            <button
                onClick={() => router.push('/planner/review')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
            Next step
      </button>
        </div>
    );
}