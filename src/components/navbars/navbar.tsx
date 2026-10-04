'use client';

import Link from 'next/link';

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
  return (
    <NavigationMenu className="absolute z-50 min-w-full p-4 bg-transparent">
      <NavigationMenuList className="flex justify-between items-center gap-4">
        <NavigationMenuItem>
          <Logo />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex items-center gap-4">
          {/*clubs */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/#clubs">Clubs</Link>}
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
          {/* <ThemeToggle /> dark mode not supported on this platform */}
          {/* Sign In */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={
              <AuthButton
                title="Sign up"
                className="min-w-25 min-h-10 text-lg! font-semibold! hover:bg-primary/90! focus-visible:outline-none! focus-visible:ring-2! focus-visible:ring-ring! focus-visible:ring-offset-2! disabled:pointer-events-none! disabled:opacity-50! dark:hover:bg-primary/80!"
              />
            }
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function UserNav() {
  return (
    <NavigationMenu className="absolute z-50 min-w-full p-4 bg-transparent">
      <NavigationMenuList className="flex justify-between items-center gap-4">
        <NavigationMenuItem>
          <Logo />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex items-center gap-4">
          {/*clubs */}
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/#clubs">Clubs</Link>}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
