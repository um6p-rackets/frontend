"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, KeyRound, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { api } from '@/lib/api/api';
import { AuthApi } from '@/lib/api/auth';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await api('/auth/forget-password', { 
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });
      setIsSuccess(true);
      toast.success("Recovery email sent!");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="border-b border-border/60 bg-muted/20 pb-6 pt-6 sm:pt-8 px-6 sm:px-8">
        <div className="mb-2 inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-brand-teal border border-teal-200/60 dark:border-teal-900/40 text-[11px] font-black italic tracking-wide uppercase">
          <KeyRound className="size-3" />
          <span>Account Recovery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-brand-ink dark:text-white">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm italic font-medium mt-1 text-muted-foreground">
          Enter your email and we'll send you a link to securely reset your password.
        </p>
      </div>
      
      <div className="p-6 sm:p-8">
        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Check your inbox</h3>
            <p className="text-sm text-muted-foreground font-medium">
              We've sent a secure reset link to <strong>{email}</strong>. The link will expire in 15 minutes.
            </p>
            <Button onClick={onSwitchToLogin} variant="outline" className="mt-4 w-full h-11 rounded-xl font-bold">
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgot}>
            <FieldGroup className="space-y-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="reset-email" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", error ? "text-destructive" : "text-muted-foreground")}>
                  <Mail className="size-3.5 text-brand-orange" /> Email Address
                </FieldLabel>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="user@um6p.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn("h-11 w-full rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all", error ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40")}
                />
                {error && (
                  <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3 shrink-0" /> {error}
                  </p>
                )}
              </Field>

              <Field className="pt-4 border-t border-border/60">
                <Button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-brand-ink hover:bg-brand-ink/90 text-white font-black italic text-sm tracking-wide shadow-md w-full flex items-center justify-center gap-2">
                  {isLoading ? <><Loader2 className="size-4 animate-spin" /> Sending...</> : <>Send Reset Link <ArrowRight className="size-4" /></>}
                </Button>
              </Field>

              <p className="text-center text-[13px] font-medium text-muted-foreground mt-3">
                Remember your password?{" "}
                <button type="button" onClick={onSwitchToLogin} className="text-brand-orange hover:text-brand-orange/80 hover:underline font-bold transition-colors cursor-pointer">
                  Sign in
                </button>
              </p>
            </FieldGroup>
          </form>
        )}
      </div>
    </div>
  );
}