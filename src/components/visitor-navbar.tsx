'use client';

import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Button } from './ui/button';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';

export function VisitorNavbar() {
  return (
    <NavigationMenu className="min-w-full p-4 bg-background ">
      <NavigationMenuList className="flex justify-between items-center gap-4">
        <NavigationMenuItem>
          <Image
            src="/two_line_logo.png"
            alt="um6p racket Logo"
            width={500}
            height={500}
            className="object-contain w-20 h-20"
          />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex items-center gap-4">
          {/*clubs */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/clubs">Clubs</Link>}
          />
          {/* About */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/about">About</Link>}
          />
          {/* Contact */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/contact">Contact</Link>}
          />
          <ThemeToggle />
          {/* Sign In */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={
              <Button
                onClick={() => {
                  console.log('Sign In clicked');
                }}
              >
                Sign In
              </Button>
            }
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
