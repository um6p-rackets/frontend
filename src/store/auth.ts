import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/contracts/auth";

type AuthState = {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);