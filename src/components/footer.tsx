import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Browse Clubs', href: '/#clubs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' }
];

function LinkList({ items }: { items: typeof links }) {
  return (
    <ul className="space-y-3">
      {items.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="hover:text-accent hover:underline">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="mt-5 py-10 px-6 bg-secondary  text-secondary-foreground center flex flex-col gap-4 items-center">
    <Separator className="bg-secondary-foreground "  style={{ height: '4px' , width: '100%'  }} />
      <div className="w-full h-full  ">
        <div className="flex justify-between h-full">
          <LinkList items={links} />
          <LinkList items={legalLinks} />

          <div className="col-span-2 space-y-1 md:col-span-1">
            <p>Location: UM6P Campus, Ben Guerir, Morocco</p>
            <p>Email: support@um6prackets.ma</p>
            <p>Hours: Monday – Sunday, 7:00 AM – 10:00 PM</p>
            <div className="mt-4 inline-block rounded-md dark:bg-white dark:p-2">
              <Image
                src="/UM6P_LOGO/COLOR/UM6P_Horizontal.png"
                alt="UM6P"
                width={200}
                height={50}
                className="h-auto w-40 sm:w-48"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
