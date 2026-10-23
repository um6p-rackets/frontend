"use client";

import { cn } from "cn";
import { User, AtSign, GraduationCap, Mail, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";
    import { UM6P_DEPARTMENTS, FormErrors } from "./constants";

    interface ProfileFormFieldsProps {
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    username: string;
    setUsername: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    department: string;
    setDepartment: (val: string) => void;
    customDepartment: string;
    setCustomDepartment: (val: string) => void;
    errors: FormErrors;
    setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
    }

    export function ProfileFormFields({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    email,
    setEmail,
    department,
    setDepartment,
    customDepartment,
    setCustomDepartment,
    errors,
    setErrors,
    }: ProfileFormFieldsProps) {
    return (
        <div className="space-y-5">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
            <Label
                htmlFor="first_name"
                className={cn(
                "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                errors.firstName ? "text-destructive" : "text-muted-foreground"
                )}
            >
                <User className="size-3.5 text-brand-orange" />
                First Name *
            </Label>
            <Input
                id="first_name"
                placeholder="e.g. Alex"
                value={firstName}
                aria-invalid={!!errors.firstName}
                onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
                className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.firstName ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40"
                )}
            />
            {errors.firstName && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.firstName}
                </p>
            )}
            </div>

            <div className="space-y-1.5">
            <Label
                htmlFor="last_name"
                className={cn(
                "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                errors.lastName ? "text-destructive" : "text-muted-foreground"
                )}
            >
                <User className="size-3.5 text-brand-orange" />
                Last Name *
            </Label>
            <Input
                id="last_name"
                placeholder="e.g. Morgan"
                value={lastName}
                aria-invalid={!!errors.lastName}
                onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
                className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.lastName ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40"
                )}
            />
            {errors.lastName && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.lastName}
                </p>
            )}
            </div>
        </div>

        {/* Username & UM6P Department Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
            <Label
                htmlFor="username"
                className={cn(
                "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                errors.username ? "text-destructive" : "text-muted-foreground"
                )}
            >
                <AtSign className="size-3.5 text-brand-orange" />
                Username *
            </Label>
            <Input
                id="username"
                placeholder="username"
                value={username}
                aria-invalid={!!errors.username}
                onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                }}
                className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.username ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40"
                )}
            />
            {errors.username && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.username}
                </p>
            )}
            </div>

            <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label
                htmlFor="department"
                className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.department || errors.customDepartment ? "text-destructive" : "text-muted-foreground"
                )}
                >
                <GraduationCap className="size-3.5 text-brand-orange" />
                Department *
                </Label>
                <span className="text-[11px] font-bold italic text-brand-orange">Required</span>
            </div>
            <Select
                value={department}
                onValueChange={(val) => {
                if (val) {
                    setDepartment(val);
                    if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
                    if (val !== "OTHER" && errors.customDepartment) setErrors((prev) => ({ ...prev, customDepartment: undefined }));
                }
                }}
            >
                <SelectTrigger
                id="department"
                aria-invalid={!!errors.department}
                className={cn(
                    "w-full h-10.5 rounded-xl bg-background/60 px-3.5 text-sm font-medium focus-visible:ring-2 transition-all",
                    errors.department || errors.customDepartment ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40"
                )}
                >
                <SelectValue placeholder="Select Department">
                    {(val) => {
                    if (!val) return "Select Department";
                    const found = UM6P_DEPARTMENTS.find((d) => d.code === val);
                    return found ? <span className="font-semibold text-brand-ink dark:text-white">{found.code}</span> : val;
                    }}
                </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl border border-border/80 shadow-2xl bg-popover z-100">
                <SelectGroup>
                    <SelectLabel className="text-[11px] font-black italic uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
                    UM6P Schools & Departments
                    </SelectLabel>
                    {UM6P_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.code} value={dept.code} className="py-2.5 px-3.5 rounded-lg cursor-pointer">
                        <span className="font-semibold text-xs text-brand-ink dark:text-gray-200">{dept.code}</span>
                    </SelectItem>
                    ))}
                </SelectGroup>
                </SelectContent>
            </Select>

            {department === "OTHER" && (
                <Input
                value={customDepartment}
                maxLength={50}
                placeholder="Specify your department..."
                onChange={(e) => {
                    setCustomDepartment(e.target.value);
                    if (errors.customDepartment) setErrors((prev) => ({ ...prev, customDepartment: undefined }));
                }}
                className={cn(
                    "mt-3 h-10.5 w-full rounded-xl bg-background/60 animate-in fade-in slide-in-from-top-2 duration-200",
                    errors.customDepartment ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40"
                )}
                />
            )}

            {errors.department ? (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.department}
                </p>
            ) : errors.customDepartment ? (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.customDepartment}
                </p>
            ) : null}
            </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
            <Label
            htmlFor="email"
            className={cn(
                "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                errors.email ? "text-destructive" : "text-muted-foreground"
            )}
            >
            <Mail className="size-3.5 text-brand-orange" />
            Email Address *
            </Label>
            <Input
            id="email"
            type="email"
            placeholder="user@um6p.ma"
            value={email}
            aria-invalid={!!errors.email}
            onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.email ? "border-destructive focus-visible:ring-destructive/30" : "border-border/80 focus-visible:ring-brand-orange/40"
            )}
            />
            {errors.email && (
            <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                {errors.email}
            </p>
            )}
        </div>
        </div>
    );
}
