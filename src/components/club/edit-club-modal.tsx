'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    } from '@/components/ui/dialog';
    import { useUpdateClub } from '@/hooks/use-clubs';

    const updateClubSchema = z.object({
    name: z
        .string()
        .min(2, 'Club name must be at least 2 characters.')
        .max(12, 'Club name cannot exceed 12 characters.'),
    description: z.string().min(1, 'Description is required.'),
    });

    type UpdateClubFormValues = z.infer<typeof updateClubSchema>;

    interface EditClubModalProps {
    clubSlug: string;
    currentName: string;
    currentDescription: string;
    }

    export default function EditClubModal({
    clubSlug,
    currentName,
    currentDescription,
    }: EditClubModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const updateClub = useUpdateClub(clubSlug);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<UpdateClubFormValues>({
        resolver: zodResolver(updateClubSchema),
        defaultValues: {
        name: currentName,
        description: currentDescription,
        },
    });

    const watchedName = watch('name') || '';

    const onSubmit = (data: UpdateClubFormValues) => {
        updateClub.mutate(data, {
        onSuccess: () => {
            setIsOpen(false);
        },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
            render={
            <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-xl border border-border/70 hover:border-brand-orange bg-card text-foreground transition-colors shadow-xs cursor-pointer focus-visible:outline-none group"
                title="Edit Club Info"
                aria-label="Edit Club Info"
            >
                <Pencil className="w-4 h-4 text-muted-foreground group-hover:text-brand-orange transition-colors" />
            </button>
            }
        />

        <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
            <DialogTitle className="text-xl font-black italic">
                Edit Club Info
            </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Club Name Field with 12 Character Limit */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                    Club Name *
                </Label>
                <span className={`text-[11px] font-bold ${watchedName.length > 12 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {watchedName.length}/12
                </span>
                </div>
                <Input
                id="name"
                maxLength={12}
                {...register('name')}
                placeholder="e.g. Badminton"
                className="h-10.5 rounded-xl bg-background/60"
                />
                {errors.name && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3 shrink-0" />
                    {errors.name.message}
                </p>
                )}
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">
                Description *
                </Label>
                <textarea
                id="description"
                {...register('description')}
                placeholder="Club description..."
                rows={4}
                className="w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.description && (
                <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3 shrink-0" />
                    {errors.description.message}
                </p>
                )}
            </div>

            <DialogFooter className="pt-2">
                <Button
                type="button"
                variant="outline"
                onClick={() => {
                    reset();
                    setIsOpen(false);
                }}
                className="rounded-xl h-10 font-bold text-xs cursor-pointer"
                >
                Cancel
                </Button>
                <Button
                type="submit"
                disabled={updateClub.isPending}
                className="rounded-xl h-10 bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-xs tracking-wide shadow-md shadow-brand-orange/20 cursor-pointer"
                >
                {updateClub.isPending ? (
                    <>
                    <Loader2 className="size-4 animate-spin mr-1.5" /> Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
}
