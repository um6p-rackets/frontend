'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, X, Users, Bell, BarChart2 } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Logo from '../logo';
import { AuthButton } from '../auth/auth-button';
import { useLogout } from '@/hooks/use-logout';
import { useNotifications } from '@/providers/NotificationProvider';
import { User } from '@/types/contracts/auth';
import { useMe } from '@/hooks/use-me';
import { NotificationCenter } from "@/components/notifications/notification-center";
import { connected } from 'process';

export default function Navbar() {
  const { data: user, isPending } = useMe();

  // Still asking the backend who is logged in: show only the logo, no wrong buttons
  if (isPending) return <PendingNav />;

  return user ? <UserNav user={user} /> : <VisitorNav />;
}

function PendingNav() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent pt-6 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex items-center w-full">
        <Logo />
      </div>
    </header>
  );
}

function VisitorNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent pt-6 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <div className="shrink-0">
          <Logo />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/#clubs">Clubs</Link>}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/about">About</Link>}
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href="/contact">Contact</Link>}
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <AuthButton
            title="Sign up"
            className="min-w-24 h-10 text-base font-semibold ml-2"
          />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-4 p-5 bg-white dark:bg-zinc-950 shadow-xl rounded-2xl border border-border flex flex-col gap-3">
          <Link href="/#clubs" onClick={() => setIsOpen(false)} className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors">
            Clubs
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors">
            About
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors">
            Contact
          </Link>
          <div className="px-2 pt-3 mt-1 border-t border-border">
            <AuthButton title="Sign up" className="w-full h-11 text-base font-semibold" />
          </div>
        </div>
      )}
    </header>
  );
}


function UserNav({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const pathname = usePathname(); 
   // still testing 
  // 1. Extract the club slug from the URL (e.g., "/clubs/badminton" -> "badminton")
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const clubsIndex = pathParts.indexOf('clubs');
  const currentClubSlug = clubsIndex !== -1 && pathParts.length > clubsIndex + 1 ? pathParts[clubsIndex + 1] : '';
  
  const isAppView = pathname?.startsWith('/clubs') || 
                    pathname?.startsWith('/leaderboard') || 
                    pathname?.startsWith('/profile');

  const performLogout = useLogout();
  
  const fallbackInitial = user?.first_name?.charAt(0)?.toUpperCase() || user?.login?.charAt(0)?.toUpperCase() || 'U';
 
  const { notifications , connected } = useNotifications();

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent pt-6 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          
          {!isAppView && (
            <NavigationMenu className="mr-2">
              <NavigationMenuList className="flex gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    render={<Link href="/#clubs">Clubs</Link>}
                  />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    render={<Link href="/about">About</Link>}
                  />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    render={<Link href="/contact">Contact</Link>}
                  />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Members Icon - NOW USING DYNAMIC SLUG */}
          {isAppView && currentClubSlug && (
            <Link 
              title="Club Members" 
              href={`/clubs/${currentClubSlug}/members`} 
              className={`flex items-center justify-center transition-colors hover:text-brand-orange ${pathname?.includes('/members') ? 'text-brand-orange' : 'text-foreground'}`}
            >
              <Users className="w-5 h-5" />
            </Link>
          )}

          {/* Notifications Sheet */}
          {/* <Sheet>
            <SheetTrigger title="Notifications" className="flex items-center justify-center text-foreground hover:text-brand-orange transition-colors outline-none bg-transparent p-0 border-none cursor-pointer">
              <Bell className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Stay updated with your club activity and matches.
                </SheetDescription>
              </SheetHeader>
                <div className="py-6 flex flex-col gap-4">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center mt-10">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.notification_id}
                      className="rounded-lg border p-3"
                    >
                      <p className="text-sm font-medium">
                        {notification.type.replaceAll('_', ' ')}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.sent_at).toLocaleString()}
                      </p>

                      {!notification.is_read && (
                        <span className="text-xs">Unread</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet> */}
          <NotificationCenter
              notifications={notifications}
              connected={connected}
            />
          {/* Leaderboard Icon */}
          {isAppView && currentClubSlug && (
            <Link 
              title="Leaderboard" 
              href={`/leaderboard`} 
              className={`flex items-center justify-center transition-colors hover:text-brand-orange ${pathname?.includes('/leaderboard') ? 'text-brand-orange' : 'text-foreground'}`}
            >
              <BarChart2 className="w-5 h-5" />
            </Link>
          )}

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center justify-center rounded-full outline-none transition-transform hover:scale-105 cursor-pointer bg-transparent p-0 ml-2 ${pathname?.startsWith('/profile') ? 'ring-2 ring-brand-orange ring-offset-2' : ''}`}>
              <Avatar className="w-10 h-10 border border-border shadow-sm">
                <AvatarImage src={user?.avatar || undefined} alt={user?.first_name || 'User'}  referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-brand-cream text-brand-orange font-bold">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full cursor-pointer">Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={performLogout} 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-4 p-5 bg-white dark:bg-zinc-950 shadow-xl rounded-2xl border border-border flex flex-col gap-3">
          
          {!isAppView && (
            <>
              <Link href="/#clubs" onClick={() => setIsOpen(false)} className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors">
                Clubs
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors">
                About
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors">
                Contact
              </Link>
            </>
          )}

          {/* Members Link - Mobile */}
          {isAppView && currentClubSlug && (
            <Link href={`/clubs/${currentClubSlug}/members`} onClick={() => setIsOpen(false)} className={`px-4 py-2 flex items-center gap-3 text-base font-semibold rounded-lg transition-colors ${pathname?.includes('/members') ? 'bg-orange-50 text-brand-orange dark:bg-orange-950/40' : 'hover:bg-muted text-foreground'}`}>
              <Users className="w-5 h-5" /> Members
            </Link>
          )}
          
          <Sheet>
            <SheetTrigger className="px-4 py-2 flex items-center gap-3 text-base font-semibold rounded-lg hover:bg-muted text-foreground transition-colors w-full text-left">
              <Bell className="w-5 h-5" /> Notifications
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="py-6 flex flex-col gap-4">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.notification_id}
                      className="rounded-lg border p-3"
                    >
                      <p className="text-sm font-medium">
                        {notification.type.replaceAll('_', ' ')}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.sent_at).toLocaleString()}
                      </p>

                      {!notification.is_read && (
                        <span className="text-xs text-primary">Unread</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Leaderboard Link - Mobile */}
          {isAppView && currentClubSlug && (
            <Link href={`/leaderboard`} onClick={() => setIsOpen(false)} className={`px-4 py-2 flex items-center gap-3 text-base font-semibold rounded-lg transition-colors ${pathname?.includes('/leaderboard') ? 'bg-orange-50 text-brand-orange dark:bg-orange-950/40' : 'hover:bg-muted text-foreground'}`}>
              <BarChart2 className="w-5 h-5" /> Leaderboard
            </Link>
          )}

          <Link href="/profile" onClick={() => setIsOpen(false)} className={`px-4 py-2 flex items-center gap-3 text-base font-semibold rounded-lg transition-colors mt-2 border-t border-border pt-4 ${pathname?.startsWith('/profile') ? 'text-brand-orange' : 'hover:bg-muted text-foreground'}`}>
            <Avatar className={`w-8 h-8 border shadow-sm shrink-0 ${pathname?.startsWith('/profile') ? 'border-brand-orange' : 'border-background'}`}>
              <AvatarImage src={user?.avatar || undefined} alt={user?.first_name || 'User'}  referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xs">
                {fallbackInitial}
              </AvatarFallback>
            </Avatar>
            <span>Profile</span>
          </Link>

          <div className="px-2 pt-2">
            <Button onClick={performLogout} variant="destructive" className="w-full h-11 text-base font-semibold">
              Log out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
