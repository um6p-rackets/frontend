"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  AtSign,
  Mail,
  GraduationCap,
  SlidersHorizontal,
  AlertCircle,
  Lock,
  ArrowRight,
  Phone,
  Users,
  Loader2,
  User,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthApi } from "@/lib/api/auth";
import { registerPayload } from "@/types";

export const UM6P_DEPARTMENTS = [
  { code: "1337", name: "1337" },
  { code: "EMINES", name: "EMINES" },
  { code: "FMS", name: "FMS" },
  { code: "CS", name: "CS" },
  { code: "SAP-D", name: "SAP-D" },
  { code: "GUP+", name: "GUP+" },
  { code: "OTHER", name: "Other" },
] as const;

function FormError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null; // Returns absolutely nothing if there is no error
  return (
    <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="size-3 shrink-0" />
      {error.message}
    </p>
  );
}

// 1. Define Zod Schema
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username is too long"),
    email: z.email("Invalid email address").max(50, "Email is too long"),
    phone: z
      .string()
      .min(10, "Phone number is required")
      .max(15, "Phone number is too long"),
    gender: z.enum(["Male", "Female"], "Gender is required"),
    department: z.string().min(1, "Department is required"),
    // Must be optional here, otherwise it throws errors when department is NOT "OTHER"
    customDepartment: z
      .string()
      .max(50, "Department name is too long")
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password is too long"),
  })
  .refine(
    (data) => {
      if (data.department === "OTHER") {
        // Enforce the min(2) requirement ONLY if OTHER is selected
        return (
          data.customDepartment && data.customDepartment.trim().length >= 2
        );
      }
      return true;
    },
    {
      message: "Please specify your department (min 2 characters)",
      path: ["customDepartment"],
    },
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      gender: undefined,
      department: "",
      customDepartment: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const watchUsername = watch("username");
  const watchDepartment = watch("department");

  // 3. Debounced Username Availability Check
  useEffect(() => {
    if (!watchUsername || watchUsername.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const { available } = await AuthApi.checkLoginAvailable(watchUsername);
        setUsernameAvailable(available);
        if (!available) {
          setError("username", {
            type: "manual",
            message: "This username is already taken",
          });
        } else if (errors.username?.type === "manual") {
          clearErrors("username");
        }
      } catch (error) {
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [watchUsername, setError, clearErrors, errors.username?.type]);

  // 4. Form Submission
  const onSubmit = async (data: RegisterFormValues) => {
    if (usernameAvailable === false) {
      setError("username", {
        type: "manual",
        message: "Please choose an available username",
      });
      return;
    }

    try {
      clearErrors("root.serverError");
      const payload: registerPayload = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        login: data.username.trim(),
        email: data.email.trim(),
        phone_number: data.phone.trim(),
        gender: data.gender === "Male",
        password: data.password,
        department:
          data.department === "OTHER"
            ? data.customDepartment!.trim()
            : data.department,
      };

      await AuthApi.register(payload);
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      // Set a dedicated root error to avoid falsely highlighting input fields
      setError("root.serverError", { type: "server", message: errorMessage });
    }
  };

  return (
    <div className="w-full flex flex-col">
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
        {/* Dedicated Server Error Display */}
        {errors.root?.serverError && (
          <div className="mb-6 bg-destructive/10 text-destructive text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p>{errors.root.serverError.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4 sm:space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name Field */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="firstName"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.firstName
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <User className="size-3.5 text-brand-orange" /> First Name
                </FieldLabel>
                <Input
                  id="firstName"
                  maxLength={50}
                  {...register("firstName")}
                  className={cn(
                    "h-11 w-full rounded-xl bg-background/60",
                    errors.firstName &&
                      "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                <FormError error={errors.firstName} />
              </Field>

              {/* Last Name Field */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="lastName"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.lastName
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <User className="size-3.5 text-brand-orange" /> Last Name
                </FieldLabel>
                <Input
                  id="lastName"
                  maxLength={50}
                  {...register("lastName")}
                  className={cn(
                    "h-11 w-full rounded-xl bg-background/60",
                    errors.lastName &&
                      "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                <FormError error={errors.lastName} />
              </Field>
            </div>

            {/* Username and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="username"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.username
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <AtSign className="size-3.5 text-brand-orange" /> Username
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="username"
                    maxLength={15}
                    {...register("username")}
                    className={cn(
                      "h-11 w-full rounded-xl bg-background/60 pr-10",
                      errors.username &&
                        "border-destructive focus-visible:ring-destructive/30",
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingUsername ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : usernameAvailable === true ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : null}
                  </div>
                </div>
                <FormError error={errors.username} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="phone"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.phone ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  <Phone className="size-3.5 text-brand-orange" /> Phone
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  maxLength={15}
                  {...register("phone")}
                  className={cn(
                    "h-11 w-full rounded-xl bg-background/60",
                    errors.phone &&
                      "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                <FormError error={errors.phone} />
              </Field>
            </div>

            {/* Email and Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="email"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.email ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  <Mail className="size-3.5 text-brand-orange" /> Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  maxLength={50}
                  {...register("email")}
                  className={cn(
                    "h-11 w-full rounded-xl bg-background/60",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                <FormError error={errors.email} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="reg-password"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.password
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <Lock className="size-3.5 text-brand-orange" /> Password
                </FieldLabel>
                <Input
                  id="reg-password"
                  type="password"
                  maxLength={20}
                  {...register("password")}
                  className={cn(
                    "h-11 w-full rounded-xl bg-background/60",
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive/30",
                  )}
                />
                <FormError error={errors.password} />
              </Field>
            </div>

            {/* Department and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="department"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.department
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <GraduationCap className="size-3.5 text-brand-orange" />{" "}
                  Department
                </FieldLabel>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        clearErrors("department");
                        if (val !== "OTHER") {
                          clearErrors("customDepartment");
                        }
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        id="department"
                        className={cn(
                          "h-11 w-full rounded-xl bg-background/60",
                          errors.department &&
                            "border-destructive focus:ring-destructive/30",
                        )}
                      >
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl max-h-60 z-[100]">
                        {UM6P_DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept.code} value={dept.code}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {watchDepartment === "OTHER" && (
                  <Input
                    {...register("customDepartment", {
                      onChange: () => clearErrors("customDepartment"),
                    })}
                    maxLength={50}
                    placeholder="Specify your department..."
                    className={cn(
                      "mt-3 h-11 w-full rounded-xl bg-background/60 animate-in fade-in slide-in-from-top-2 duration-200",
                      errors.customDepartment &&
                        "border-destructive focus-visible:ring-destructive/30",
                    )}
                  />
                )}
                <FormError
                  error={errors.department || errors.customDepartment}
                />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="gender"
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                    errors.gender
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <Users className="size-3.5 text-brand-orange" /> Gender
                </FieldLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        clearErrors("gender"); // Clears the gender error immediately on selection
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        id="gender"
                        className={cn(
                          "h-11 w-full rounded-xl bg-background/60",
                          errors.gender &&
                            "border-destructive focus:ring-destructive/30",
                        )}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl z-[100]">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.gender} />
              </Field>
            </div>

            <Field className="pt-4 border-t border-border/60">
              <Button
                type="submit"
                disabled={isSubmitting || usernameAvailable === false}
                className="h-11 w-full rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-sm tracking-wide shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Creating
                    Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="size-4" />
                  </>
                )}
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
