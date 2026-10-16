"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { useAuthPopupStore } from "@/store/auth_popup"; 
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Corrected: Removed curly braces because Navbar is a default export
import Navbar from "@/components/navbars/navbar"; 

export default function AuthRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuth((state) => state.user);
  const openPopup = useAuthPopupStore((state) => state.open);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      openPopup("login");
    }
  }, [isMounted, user, openPopup]);

  if (!isMounted) {
    return null; 
  }

  // Show a clean locked background behind the popup
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200/60 dark:border-orange-900/40 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-brand-ink dark:text-white mb-3">
          Authentication Required
        </h1>
        <p className="text-muted-foreground font-medium mb-8 max-w-sm text-sm sm:text-base">
          You must be logged in to view club details, leaderboards, and your athlete profile.
        </p>
        
        <Button 
          onClick={() => openPopup("login")}
          className="h-11 px-8 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-base tracking-wide shadow-md shadow-brand-orange/20"
        >
          Sign In to Access
        </Button>
      </div>
    );
  }

  // If the user is logged in, render the Navbar at the top, then the page content below it!
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* <-- The Navbar is now shared across all protected pages */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}