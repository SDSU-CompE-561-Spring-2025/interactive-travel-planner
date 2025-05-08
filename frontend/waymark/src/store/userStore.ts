import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: { id: number; username: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  userId: number | null;
  setUser: (user: any, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      userId: null,
      setUser: (user, token) =>
        set({ user, token, isAuthenticated: true, userId: user.id }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, userId: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
