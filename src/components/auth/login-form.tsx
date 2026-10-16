"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, Lock, SlidersHorizontal, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { api } from '@/lib/api/api';
import { useAuth } from '@/store/auth';

interface FormErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuth((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = "Email address is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        email: email.trim(),
        password: password,
      };

      const response = (await api('/auth/login', { 
        method: 'POST',
        body: JSON.stringify(payload)
      })) as { user?: Parameters<typeof setUser>[0]; token?: string } & Parameters<typeof setUser>[0];

      if (setUser && response) {
        const userData = response.user ? response.user : response;
        
        const token = response.token || ""; 
        
        setUser(userData, token); 
      }

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password.";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="border-b border-border/60 bg-muted/20 pb-6 pt-6 sm:pt-8 px-6 sm:px-8">
        <div className="mb-2 inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200/60 dark:border-orange-900/40 text-[11px] font-black italic tracking-wide uppercase">
          <SlidersHorizontal className="size-3" />
          <span>Welcome Back</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-brand-ink dark:text-white">
          Login to Account
        </h2>
        <p className="text-xs sm:text-sm italic font-medium mt-1 text-muted-foreground">
          Enter your credentials to access your UM6P Racket dashboard.
        </p>
      </div>
      
      <div className="p-6 sm:p-8">
        <form onSubmit={handleLogin}>
          <FieldGroup className="space-y-4">
            
            <Field className="space-y-1.5">
              <FieldLabel htmlFor="email" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.email ? "text-destructive" : "text-muted-foreground")}>
                <Mail className="size-3.5 text-brand-orange" /> Email Address
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="user@um6p.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn("h-11 w-full rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all", errors.email ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40")}
              />
              {errors.email && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3 shrink-0" /> {errors.email}
                </p>
              )}
            </Field>

            <Field className="space-y-1.5">
              <FieldLabel htmlFor="password" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.password ? "text-destructive" : "text-muted-foreground")}>
                <Lock className="size-3.5 text-brand-orange" /> Password
              </FieldLabel>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn("h-11 w-full rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all", errors.password ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40")}
              />
              {errors.password && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3 shrink-0" /> {errors.password}
                </p>
              )}
            </Field>

            <Field className="pt-4 border-t border-border/60">
              <Button type="submit" disabled={isLoading} className="h-11 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-sm tracking-wide shadow-md shadow-brand-orange/20 w-full flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 className="size-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="size-4" /></>}
              </Button>
            </Field>

            <p className="text-center text-[13px] font-medium text-muted-foreground mt-3">
              Dont have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-brand-orange hover:text-brand-orange/80 hover:underline font-bold transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </p>

          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
