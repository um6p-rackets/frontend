"use client";

import { useState } from "react";
import { cn } from "cn";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  UM6P_DEPARTMENTS,
  SettingsProfile1Props,
  FormErrors,
} from "./constants";
import { ProfileAvatarUpload } from "./profile-avatar-upload";
import { ProfileFormFields } from "./profile-form-fields";

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

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
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
    if (!validate()) return;

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
      <div className="px-6 sm:px-7 pt-6 pb-4 border-b border-border/60 bg-muted/20 flex items-center justify-between gap-4">
        <div className="w-8" />
        <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-brand-ink dark:text-white text-center">
          Profile Settings
        </h2>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="size-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-brand-ink dark:hover:text-white hover:bg-muted/80 transition-colors cursor-pointer border border-border/60 shrink-0"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 space-y-5">
        <ProfileAvatarUpload
          avatarFiles={avatarFiles}
          setAvatarFiles={setAvatarFiles}
          avatarPreview={avatarPreview}
          firstName={firstName}
          username={username}
          initials={initials}
          hasAvatar={avatarFiles.length > 0 || !!currentAvatar}
          onRemoveAvatar={handleRemoveAvatar}
        />

        <ProfileFormFields
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          department={department}
          setDepartment={setDepartment}
          customDepartment={customDepartment}
          setCustomDepartment={setCustomDepartment}
          errors={errors}
          setErrors={setErrors}
        />
      </div>

      {/* Footer */}
      <div className="px-6 sm:px-7 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-end gap-3">
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
