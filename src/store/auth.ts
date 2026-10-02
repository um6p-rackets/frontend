import { create } from "zustand";

type Role = "visitor" | "member" | "leader" | "coach";

type AuthState = {
  user: { id: string; name: string } | null;
  role: Role;
  setUser: (user: AuthState["user"], role: Role) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  role: "visitor",
  setUser: (user, role) => set({ user, role }),
  logout: () => set({ user: null, role: "visitor" }),
}));