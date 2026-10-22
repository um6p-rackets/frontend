'use client';

import { AuthApi } from "@/lib/api/auth";
import { useAuth } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const setUser = useAuth((s) => s.setAuth);
    const isOauthSuccess = searchParams.get('oauth') === 'success';

    const [isMounted, setIsMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (localStorage.getItem('is_authenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: AuthApi.getMe,
        enabled: isMounted && (isOauthSuccess || isAuthenticated),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (!userProfile) return;

        localStorage.setItem('is_authenticated', 'true');
        setUser(userProfile);
        
        if (isOauthSuccess) {
            const url = new URL(window.location.href);
            url.searchParams.delete('oauth');
            window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
    }, [userProfile, isOauthSuccess, setUser]);


    if (isMounted && isOauthSuccess && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="size-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return <>{children}</>;
}