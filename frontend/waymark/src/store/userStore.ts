import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: { id: number; username: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: any, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);
