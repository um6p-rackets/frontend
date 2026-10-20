"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthApi } from "@/lib/api/auth";
import { useAuth } from "@/store/auth";

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    // 1. Get the current user from Zustand
    const user = useAuth((state) => state.user);
    const [isMounted, setIsMounted] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");

    // 2. Guest-Only Protection: Redirect to home if the user is already logged in
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 3. Guest-Only Protection
    useEffect(() => {
        if (isMounted && user) {
            router.replace("/");
        }
    }, [isMounted, user, router]);

    const resetMutation = useMutation({
        mutationFn: (newPassword: string) => {
            if (!token) throw new Error("Missing reset token");
            return AuthApi.resetPassword({ token, newPassword });
        },
        onSuccess: () => {
            setPassword("");
            setConfirmPassword("");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        if (!password || password.length < 8) {
            setValidationError("Password must be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        resetMutation.mutate(password);
    };

    if (!isMounted) {
        return (
            <div className="p-12 flex flex-col items-center justify-center">
                <Loader2 className="size-8 animate-spin text-brand-orange mb-4" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Verifying secure session...</p>
            </div>
        );
    }

    // If the user exists in state, render nothing while the useEffect redirects them
    if (user) return null;

    // 1. Handle Missing Token State
    if (!token) {
        return (
            <div className="text-center p-8">
                <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black italic text-brand-ink dark:text-white mb-2">Invalid Link</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    This password reset link is invalid or missing a security token. Please request a new link.
                </p>
                <Button onClick={() => router.push('/')} variant="outline" className="w-full h-11 rounded-xl">
                    Return to Home
                </Button>
            </div>
        );
    }

    // 2. Handle Success State
    if (resetMutation.isSuccess) {
        return (
            <div className="text-center p-8 animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-200">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black italic text-brand-ink dark:text-white mb-2">Password Reset!</h2>
                <p className="text-muted-foreground text-sm mb-8">
                    Your password has been successfully updated. You can now use your new password to sign in.
                </p>
                <Button
                    // onClick={() => router.push('/?login=true')} // You can handle this query param to auto-open your login modal!
                    className="h-11 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic w-full"
                >
                    Sign In Now <ArrowRight className="ml-2 size-4" />
                </Button>
            </div>
        );
    }

    // 3. Main Form State
    return (
        <div className="w-full flex flex-col">
            <div className="border-b border-border/60 bg-muted/20 pb-6 pt-8 px-6 sm:px-8">
                <div className="mb-2 inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200/60 dark:border-orange-900/40 text-[11px] font-black italic tracking-wide uppercase">
                    <ShieldCheck className="size-3" />
                    <span>Secure Update</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-brand-ink dark:text-white">
                    Create New Password
                </h2>
                <p className="text-xs sm:text-sm italic font-medium mt-1 text-muted-foreground">
                    Please enter and confirm your new password below.
                </p>
            </div>

            <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                    <FieldGroup className="space-y-4">

                        <Field className="space-y-1.5">
                            <FieldLabel htmlFor="password" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-muted-foreground">
                                <Lock className="size-3.5 text-brand-orange" /> New Password
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 w-full rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all border-border/80 focus-visible:ring-brand-orange/40"
                            />
                        </Field>

                        <Field className="space-y-1.5">
                            <FieldLabel htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-muted-foreground">
                                <Lock className="size-3.5 text-brand-orange" /> Confirm Password
                            </FieldLabel>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-11 w-full rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all border-border/80 focus-visible:ring-brand-orange/40"
                            />
                        </Field>

                        {/* Error Displays */}
                        {(validationError || resetMutation.isError) && (
                            <div className="bg-destructive/10 text-destructive text-xs font-semibold p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                <p>{validationError || resetMutation.error?.message || "Failed to reset password. The link may have expired."}</p>
                            </div>
                        )}

                        <Field className="pt-4 border-t border-border/60">
                            <Button
                                type="submit"
                                disabled={resetMutation.isPending}
                                className="h-11 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-sm tracking-wide shadow-md shadow-brand-orange/20 w-full flex items-center justify-center gap-2"
                            >
                                {resetMutation.isPending ? (
                                    <><Loader2 className="size-4 animate-spin" /> Updating...</>
                                ) : (
                                    <>Reset Password <ArrowRight className="size-4" /></>
                                )}
                            </Button>
                        </Field>

                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}

// Layout Wrapper matching your aesthetic
export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <div className="w-full max-w-md bg-card rounded-2xl md:rounded-3xl border border-border/80 shadow-xs overflow-hidden relative">
                <Suspense fallback={
                    <div className="p-12 flex flex-col items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-brand-orange mb-4" />
                        <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading secure session...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}