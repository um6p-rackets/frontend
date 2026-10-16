import { create } from 'zustand';

interface AuthPopupState {
  isOpen: boolean;
  activeTab: "login" | "register";
  open: (tab?: "login" | "register") => void;
  close: () => void;
  setTab: (tab: "login" | "register") => void;
}

export const useAuthPopupStore = create<AuthPopupState>((set) => ({
  isOpen: false,
  activeTab: "login",
  open: (tab = "login") => set({ isOpen: true, activeTab: tab }),
  close: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab }),
}));