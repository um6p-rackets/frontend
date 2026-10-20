"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AtSign, Mail, GraduationCap, SlidersHorizontal, AlertCircle, Lock, ArrowRight, Phone, Users, Loader2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api/api';
import { AuthApi } from "@/lib/api/auth";
import { registerPayload } from "@/types";

export const UM6P_DEPARTMENTS = [
  { code: "1337", name: "1337 Coding School" },
  { code: "CAES", name: "Center for Advanced Economy Studies" },
  { code: "GTI", name: "Green Tech Institute" },
  { code: "CS", name: "Computer Science" },
  { code: "SAP-D", name: "School of Architecture, Planning & Design" },
  { code: "EMINES", name: "School of Industrial Management" },
  { code: "SASE", name: "School of Agricultural & Environmental Sciences" },
  { code: "ABS", name: "Africa Business School" },
  { code: "OTHER", name: "Other (Please specify)" },
] as const;

interface FormErrors {
  firstName?: string; lastName?: string; username?: string; email?: string;
  password?: string; phone?: string; gender?: string; department?: string; customDepartment?: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) newErrors.firstName = "Required.";
    if (!lastName.trim()) newErrors.lastName = "Required.";
    if (!username.trim()) newErrors.username = "Required.";
    if (!email.trim()) newErrors.email = "Required.";
    if (!phone.trim()) newErrors.phone = "Required.";
    if (!gender) newErrors.gender = "Select a gender.";
    if (!password.trim() || password.length < 8) newErrors.password = "Min 8 chars.";

    if (!department) {
      newErrors.department = "Required.";
    } else if (department === "OTHER" && !customDepartment.trim()) {
      newErrors.customDepartment = "Please specify.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload : registerPayload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        login: username.trim(),
        email: email.trim(),
        phone_number: phone.trim(),
        gender: gender === "Male",
        password: password,
        department: department === "OTHER" ? customDepartment.trim() : department,
      };

      await AuthApi.register(payload);

      if (onSuccess)
        onSuccess();

    } catch (error) {
      // console.error("Registration failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col ">
      <div className="border-b border-border/60 bg-muted/20 pb-4 pt-6 sm:pt-8 px-6 sm:px-8 shrink-0">
        <div className="mb-2 inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200/60 dark:border-orange-900/40 text-[11px] font-black italic tracking-wide uppercase">
          <SlidersHorizontal className="size-3" />
          <span>Create Account</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-brand-ink dark:text-white">
          Join UM6P Racket
        </h2>
        <p className="text-xs sm:text-sm italic font-medium mt-1 text-muted-foreground">
          Set up your athlete profile to start booking matches.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleRegister}>
          <FieldGroup className="space-y-4 sm:space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="firstName" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.firstName ? "text-destructive" : "text-muted-foreground")}>
                  <User className="size-3.5 text-brand-orange" /> First Name
                </FieldLabel>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={cn("h-11 w-full rounded-xl bg-background/60", errors.firstName && "border-destructive")} />
                {errors.firstName && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.firstName}</p>}
              </Field>
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="lastName" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.lastName ? "text-destructive" : "text-muted-foreground")}>
                  <User className="size-3.5 text-brand-orange" /> Last Name
                </FieldLabel>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={cn("h-11 w-full rounded-xl bg-background/60", errors.lastName && "border-destructive")} />
                {errors.lastName && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.lastName}</p>}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="username" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.username ? "text-destructive" : "text-muted-foreground")}>
                  <AtSign className="size-3.5 text-brand-orange" /> Username
                </FieldLabel>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className={cn("h-11 w-full rounded-xl bg-background/60", errors.username && "border-destructive")} />
                {errors.username && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.username}</p>}
              </Field>
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="phone" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.phone ? "text-destructive" : "text-muted-foreground")}>
                  <Phone className="size-3.5 text-brand-orange" /> Phone
                </FieldLabel>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn("h-11 w-full rounded-xl bg-background/60", errors.phone && "border-destructive")} />
                {errors.phone && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.phone}</p>}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="department" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.department ? "text-destructive" : "text-muted-foreground")}>
                  <GraduationCap className="size-3.5 text-brand-orange" /> Department
                </FieldLabel>
                <Select value={department} onValueChange={(val) => setDepartment(val || "")}>
                  <SelectTrigger id="department" className={cn("h-11 w-full rounded-xl bg-background/60", errors.department && "border-destructive")}>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60 z-[100]">
                    {UM6P_DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {department === "OTHER" && (
                  <Input placeholder="Specify your department..." value={customDepartment} onChange={(e) => setCustomDepartment(e.target.value)} className={cn("mt-3 h-11 w-full rounded-xl bg-background/60 animate-in fade-in slide-in-from-top-2 duration-200", errors.customDepartment && "border-destructive")} />
                )}
                {errors.department && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.department}</p>}
              </Field>
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="gender" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.gender ? "text-destructive" : "text-muted-foreground")}>
                  <Users className="size-3.5 text-brand-orange" /> Gender
                </FieldLabel>
                <Select value={gender} onValueChange={(val) => setGender(val || "")}>
                  <SelectTrigger id="gender" className={cn("h-11 w-full rounded-xl bg-background/60", errors.gender && "border-destructive")}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl z-[100]">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.gender}</p>}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="email" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.email ? "text-destructive" : "text-muted-foreground")}>
                  <Mail className="size-3.5 text-brand-orange" /> Email
                </FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cn("h-11 w-full rounded-xl bg-background/60", errors.email && "border-destructive")} />
                {errors.email && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.email}</p>}
              </Field>
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="reg-password" className={cn("text-xs font-bold uppercase tracking-wider flex items-center gap-1.5", errors.password ? "text-destructive" : "text-muted-foreground")}>
                  <Lock className="size-3.5 text-brand-orange" /> Password
                </FieldLabel>
                <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={cn("h-11 w-full rounded-xl bg-background/60", errors.password && "border-destructive")} />
                {errors.password && <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{errors.password}</p>}
              </Field>
            </div>

            <Field className="pt-4 border-t border-border/60">
              <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-sm tracking-wide shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 className="size-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="size-4" /></>}
              </Button>
            </Field>

            <p className="text-center text-[13px] font-medium text-muted-foreground mt-3">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-brand-orange hover:text-brand-orange/80 hover:underline font-bold transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
