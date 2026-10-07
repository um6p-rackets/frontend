'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import Logo from '../logo';
import { AuthButton } from '../auth/auth-button';
import { useAuth } from '@/store/auth';

export default function Navbar() {
  const user = useAuth((state) => state.user);
  return user ? <UserNav /> : <VisitorNav />;
}

function VisitorNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 1. bg-transparent مع padding من الفوق (pt-6) ومن الجناب (px-6/12/16) باش يبعد على الحواف
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent pt-6 px-6 md:px-12 lg:px-16">
      <div className="max-w-8xl mx-auto flex justify-between items-center w-full">
        
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
          <Link
            href="/#clubs"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors"
          >
            Clubs
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors"
          >
            Contact
          </Link>
          <div className="px-2 pt-3 mt-1 border-t border-border">
            <AuthButton
              title="Sign up"
              className="w-full h-11 text-base font-semibold"
            />
          </div>
        </div>
      )}
    </header>
  );
}

function UserNav() {
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
            </NavigationMenuList>
          </NavigationMenu>
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
          <Link
            href="/#clubs"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-base font-semibold rounded-lg hover:bg-muted transition-colors"
          >
            Clubs
          </Link>
        </div>
      )}
    </header>
  );
}