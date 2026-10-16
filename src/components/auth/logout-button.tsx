'use client';

import { Button } from '../ui/button';
import { useAuth } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';

export function LogoutButton({ className }: { className?: string }) {
    const logout = useAuth((s) => s.logout);
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        try {
        await api('/auth/logout', { method: 'POST' });
        } catch (error) {
        console.warn('Backend logout failed, clearing local state anyway.');
        } finally {
        logout();
        queryClient.clear();
        }
    };

    return (
        <Button 
        onClick={handleLogout} 
        variant="destructive"
        className={`${className || ''}`}
        >
        Logout
        </Button>
    );
}
