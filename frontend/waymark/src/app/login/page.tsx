'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
  const { setUser } = useUserStore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // 1. Get token
      const res = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      const token = data.access_token;

      // 2. Get user info
      const userRes = await fetch('http://localhost:8000/auth/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await userRes.json();

      // 3. Save to Zustand
      setUser(user, token);
      router.push('/planner/start');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}
