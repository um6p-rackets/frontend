"use client";

import { Camera, Trash2 } from "lucide-react";
import {
    FileUpload,
    FileUploadTrigger,
    } from "@/components/diceui/file-upload";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

    interface ProfileAvatarUploadProps {
    avatarFiles: File[];
    setAvatarFiles: (files: File[]) => void;
    avatarPreview?: string;
    firstName: string;
    username: string;
    initials: string;
    hasAvatar: boolean;
    onRemoveAvatar: () => void;
    }

    export function ProfileAvatarUpload({
    avatarFiles,
    setAvatarFiles,
    avatarPreview,
    firstName,
    username,
    initials,
    hasAvatar,
    onRemoveAvatar,
    }: ProfileAvatarUploadProps) {
    return (
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

                {hasAvatar && (
                <button
                    type="button"
                    onClick={onRemoveAvatar}
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
    );
}
