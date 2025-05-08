'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">About Travel Planner</h1>

        <p className="text-lg text-gray-700 mb-6 text-center">
          Travel Planner is a fullstack trip management tool to help you plan, track, and collaborate on your journeys with ease.
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">What You Can Do</h2>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
            <li>Create, view, and manage trips</li>
            <li>Add destinations, budgets, and calendar events</li>
            <li>Collaborate with friends or teammates</li>
            <li>Track itineraries and travel dates</li>
            <li>Login securely with JWT authentication</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
            <li><strong>Backend:</strong> FastAPI, SQLAlchemy, JWT Auth</li>
            <li><strong>Frontend:</strong> Next.js (App Router), Tailwind CSS</li>
            <li><strong>State:</strong> Zustand (auth/session)</li>
            <li><strong>Database:</strong> SQLite / PostgreSQL</li>
          </ul>
        </div>

        <p className="text-gray-500 text-sm mt-10 text-center">
          Built with 💙 for travelers and developers alike.
        </p>
      </div>
    </div>
  );
}
