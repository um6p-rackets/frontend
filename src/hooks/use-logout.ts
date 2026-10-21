'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthApi } from '@/lib/api/auth';
import { useAuth } from '@/store/auth';

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearAuth = useAuth((state) => state.logout);

  const performLogout = async () => {
    try {
      await AuthApi.logout(); // Clears HttpOnly cookies & localStorage flag
    } catch (error) {
      console.warn('Backend logout failed, clearing local state anyway.');
    } finally {
      queryClient.clear(); // Wipes sensitive data from React Query memory
      clearAuth(); // Clears Zustand user state
      router.push('/'); // Redirects to home
    }
  };

  return performLogout;
}