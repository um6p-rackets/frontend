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
        <div className="flex items-center gap-5 py-2">
            {/* Larger Clickable Avatar with Camera Hover Effect */}
            <FileUploadTrigger
            type="button"
            className="group relative size-20 sm:size-24 shrink-0 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 outline-none"
            >
            <Avatar className="size-20 sm:size-24 border-2 border-border/60 shadow-md">
                <AvatarImage
                src={avatarPreview}
                alt={firstName || username}
                className="object-cover"
                />
                <AvatarFallback className="bg-brand-cream text-brand-orange font-black text-2xl sm:text-3xl">
                {initials}
                </AvatarFallback>
            </Avatar>
            
            {/* Dark Overlay with Camera Icon on Hover */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 backdrop-blur-[1px] opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white drop-shadow" />
            </div>

            {/* Camera Badge on Bottom Right */}
            <div className="absolute bottom-0 right-0 bg-brand-orange text-white p-1.5 rounded-full shadow-sm border-2 border-background">
                <Camera className="size-3.5" />
            </div>
            </FileUploadTrigger>

            {/* Larger Text and Remove Action */}
            <div className="flex flex-col items-start gap-1.5 flex-1">
            <span className="text-base sm:text-lg font-black italic tracking-tight text-brand-ink dark:text-white">
                Profile Picture
            </span>

            {hasAvatar && (
                <button
                type="button"
                onClick={onRemoveAvatar}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold italic text-destructive hover:underline transition-all cursor-pointer p-0 h-auto bg-transparent"
                >
                <Trash2 className="size-4" />
                <span>Remove</span>
                </button>
            )}
            </div>
        </div>
        </FileUpload>
    );
}
