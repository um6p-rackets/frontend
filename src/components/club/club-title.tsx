import Image from 'next/image';
import { Card } from '../ui/card';

export default function ClubTitle({
  name,
  slug,
  avatar,
}: {
  name: string;
  slug?: string;
  avatar?: string;
}) {
  const cleanName = name.replace(/club/i, '').trim();
  const formattedName = cleanName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const avatarSrc = avatar || (slug ? `/clubs/${slug}.png` : undefined);

  return (
    <div className="pt-2 sm:pt-4">
      {/* Mobile Header Card */}
      <Card className="sm:hidden p-4 rounded-xl border border-border/70 shadow-2xs bg-card flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {avatarSrc && (
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center p-2 shrink-0">
              <Image
                src={avatarSrc}
                alt={formattedName}
                width={36}
                height={36}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-accent leading-tight truncate">
              {formattedName} <span className="text-foreground">Club</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Official Campus Club
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-accent/10 border border-accent/20 text-accent shrink-0">
          Official
        </span>
      </Card>

      {/* Desktop / Tablet Header */}
      <div className="hidden sm:flex items-center gap-3.5">
        {avatarSrc && (
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center p-2 shrink-0">
            <Image
              src={avatarSrc}
              alt={formattedName}
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-accent">
          {formattedName} <span className="text-foreground">Club</span>
        </h1>
      </div>
    </div>
  );
}
