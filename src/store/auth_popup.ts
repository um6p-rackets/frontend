import {create} from 'zustand';

interface AuthPopupState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAuthPopupStore = create<AuthPopupState>((set) => ({
  isOpen: false,
  open: () => set({isOpen: true}),
  close: () => set({isOpen: false})
}));