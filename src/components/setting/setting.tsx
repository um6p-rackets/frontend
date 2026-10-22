"use client";

import { useState } from "react";
import { cn } from "cn";
import {
  Camera,
  X,
  User,
  AtSign,
  Mail,
  GraduationCap,
  SlidersHorizontal,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/diceui/file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

export const UM6P_DEPARTMENTS = [
  { code: "1337", name: "1337" },
  { code: "EMINES", name: "EMINES" },
  { code: "FMS", name: "FMS" },
  { code: "CS", name: "CS" },
  { code: "SAP-D", name: "SAP-D" },
  { code: "GUP+", name: "GUP+" },
  { code: "OTHER", name: "Other" },
] as const;

export type Um6pDepartmentCode = (typeof UM6P_DEPARTMENTS)[number]["code"];

export interface ProfileFormData {
  first_name?: string;
  last_name?: string;
  name: string;
  username: string;
  email: string;
  avatar?: string | null;
  department: string;
  customDepartment?: string;
}

export interface SettingsProfile1Props {
  defaultValues?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
  onCancel?: () => void;
  className?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  department?: string;
  customDepartment?: string;
}

const SettingsProfile1 = ({
  defaultValues = {
    name: "Alex Morgan",
    first_name: "Alex",
    last_name: "Morgan",
    email: "alex.morgan@um6p.ma",
    username: "alexmorgan",
    department: "1337",
    customDepartment: "",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
  },
  onSave,
  onCancel,
  className,
}: SettingsProfile1Props) => {
  const initialFirstName =
    defaultValues.first_name ??
    (defaultValues.name ? defaultValues.name.split(" ")[0] : "Alex");
  const initialLastName =
    defaultValues.last_name ??
    (defaultValues.name ? defaultValues.name.split(" ").slice(1).join(" ") : "Morgan");

  const isPresetDepartment = (dept?: string) =>
    dept ? UM6P_DEPARTMENTS.some((d) => d.code === dept) : true;

  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState<string | null | undefined>(
    defaultValues.avatar
  );
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(defaultValues.email ?? "");
  const [username, setUsername] = useState(defaultValues.username ?? "");

  const initialDeptValue = defaultValues.department || "1337";
  const [department, setDepartment] = useState(
    isPresetDepartment(initialDeptValue) ? initialDeptValue : "OTHER"
  );
  const [customDepartment, setCustomDepartment] = useState(
    isPresetDepartment(initialDeptValue) ? (defaultValues.customDepartment || "") : initialDeptValue
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const initials = (
    (firstName.charAt(0) || "") + (lastName.charAt(0) || "")
  ).toUpperCase() || (username.slice(0, 2).toUpperCase() || "UM");

  // Get preview URL from uploaded file or current avatar
  const avatarPreview =
    avatarFiles.length > 0
      ? URL.createObjectURL(avatarFiles[0])
      : (currentAvatar || undefined);

  const handleRemoveAvatar = () => {
    setAvatarFiles([]);
    setCurrentAvatar(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!department) {
      newErrors.department = "Please select your UM6P department.";
    } else if (department === "OTHER" && (!customDepartment || customDepartment.trim().length < 2)) {
      newErrors.customDepartment = "Please specify your department (min 2 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const finalDepartment = department === "OTHER" ? customDepartment.trim() : department;

    onSave?.({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      name: fullName || username,
      username: username.trim(),
      email: email.trim(),
      department: finalDepartment,
      customDepartment: department === "OTHER" ? customDepartment.trim() : undefined,
      avatar: avatarFiles.length > 0 ? avatarPreview : (currentAvatar || null),
    });
  };

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto bg-card rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 sm:px-7 pt-6 pb-4 border-b border-border/60 bg-muted/20 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-brand-orange border border-orange-200/60 dark:border-orange-900/40 text-[11px] font-black italic tracking-wide uppercase">
            <SlidersHorizontal className="size-3" />
            <span>Profile Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-brand-ink dark:text-white mt-2">
            Athlete Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground italic font-medium mt-0.5">
            Manage your campus identity, contact info, and UM6P department.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="size-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-brand-ink dark:hover:text-white hover:bg-muted/80 transition-colors cursor-pointer border border-border/60 shrink-0 mt-1"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 space-y-5">
        {/* Avatar Upload */}
        <FileUpload
          value={avatarFiles}
          onValueChange={setAvatarFiles}
          accept="image/*"
          maxFiles={1}
          maxSize={2 * 1024 * 1024}
        >
          <div className="bg-secondary/50 dark:bg-[#121417] border border-border/60 dark:border-border/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <FileUploadTrigger
              type="button"
              className="group relative size-20 sm:size-22 shrink-0 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 outline-none"
            >
              <Avatar className="size-20 sm:size-22 border-3 border-background shadow-md">
                <AvatarImage
                  src={avatarPreview}
                  alt={firstName || username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-brand-cream text-brand-orange font-black text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 backdrop-blur-[1px] opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-5 text-white drop-shadow" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-brand-orange text-white p-1.5 rounded-full shadow-sm border-2 border-background">
                <Camera className="size-3" />
              </div>
            </FileUploadTrigger>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1">
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <p className="text-sm font-black italic text-brand-ink dark:text-white">
                    Profile Picture
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100/70 dark:bg-orange-950/50 text-brand-orange text-[10px] font-bold italic">
                    Avatar
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic mt-0.5">
                  PNG, JPG or WEBP (Max 2MB).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FileUploadTrigger
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-bold italic text-brand-ink dark:text-white hover:bg-muted transition-colors shadow-2xs cursor-pointer"
                >
                  <Camera className="size-3.5 text-brand-orange" />
                  <span>Change Photo</span>
                </FileUploadTrigger>

                {(avatarFiles.length > 0 || currentAvatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold italic text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </FileUpload>

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
                if (errors.firstName) {
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }
              }}
              className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.firstName
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-border/80 focus-visible:ring-brand-orange/40"
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
                if (errors.lastName) {
                  setErrors((prev) => ({ ...prev, lastName: undefined }));
                }
              }}
              className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.lastName
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-border/80 focus-visible:ring-brand-orange/40"
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
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }
              }}
              className={cn(
                "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
                errors.username
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-border/80 focus-visible:ring-brand-orange/40"
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
              <span className="text-[11px] font-bold italic text-brand-orange">
                Required
              </span>
            </div>
            <Select
              value={department}
              onValueChange={(val) => {
                if (val) {
                  setDepartment(val);
                  if (errors.department) {
                    setErrors((prev) => ({ ...prev, department: undefined }));
                  }
                  if (val !== "OTHER" && errors.customDepartment) {
                    setErrors((prev) => ({ ...prev, customDepartment: undefined }));
                  }
                }
              }}
            >
              <SelectTrigger
                id="department"
                aria-invalid={!!errors.department}
                className={cn(
                  "w-full h-10.5 data-[size=default]:h-10.5 rounded-xl bg-background/60 px-3.5 text-sm font-medium focus-visible:ring-2 transition-all",
                  (errors.department || errors.customDepartment)
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-border/80 focus-visible:ring-brand-orange/40"
                )}
              >
                <SelectValue placeholder="Select Department">
                  {(val) => {
                    if (!val) return "Select Department";
                    const found = UM6P_DEPARTMENTS.find((d) => d.code === val);
                    if (!found) return val;
                    return (
                      <span 
                        title={found.name}
                        className="font-semibold text-brand-ink dark:text-white cursor-help"
                      >
                        {found.code}
                      </span>
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 rounded-xl border border-border/80 shadow-2xl bg-popover z-100">
                <SelectGroup>
                  <SelectLabel className="text-[11px] font-black italic uppercase tracking-wider text-muted-foreground px-2.5 py-1.5">
                    UM6P Schools & Departments
                  </SelectLabel>
                  {UM6P_DEPARTMENTS.map((dept) => (
                    <SelectItem
                      key={dept.code}
                      value={dept.code}
                      className="py-2.5 px-3.5 rounded-lg cursor-pointer"
                    >
                      <span 
                        title={dept.name}
                        className="font-semibold text-xs text-brand-ink dark:text-gray-200 cursor-help"
                      >
                        {dept.code}
                      </span>
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
                  if (errors.customDepartment) {
                    setErrors((prev) => ({ ...prev, customDepartment: undefined }));
                  }
                }}
                className={cn(
                  "mt-3 h-10.5 w-full rounded-xl bg-background/60 animate-in fade-in slide-in-from-top-2 duration-200",
                  errors.customDepartment
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-border/80 focus-visible:ring-brand-orange/40"
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
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            className={cn(
              "h-10.5 rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
              errors.email
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-border/80 focus-visible:ring-brand-orange/40"
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

      {/* Footer */}
      <div className="px-6 sm:px-7 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground italic">
          <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span>UM6P Campus Athlete</span>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            className="h-10 px-4 rounded-xl font-bold italic text-xs border-border/80 hover:bg-muted text-brand-ink dark:text-gray-200 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-xs tracking-wide shadow-md shadow-brand-orange/20 cursor-pointer"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SettingsProfile1 };
