import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ClubCardProps = {
  name: string;
  imageUrl: string;
  link: string;
};

export default function ClubCard({ name, imageUrl, link }: ClubCardProps) {
  return (
    <Link 
      href={link}
      className="group relative block w-full max-w-85 sm:max-w-100 md:max-w-115 h-42.5 md:h-52.5 rounded-none shadow-md border-0 bg-white overflow-visible transition-all duration-500 hover:shadow-xl cursor-pointer"
    >
      
      <div className="absolute top-0 right-20 sm:right-32 md:right-20 w-14 md:w-18 h-full bg-accent z-0 transition-all duration-500 ease-out group-hover:w-full group-hover:right-0" />

      <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-7 md:p-8">
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-[36px] font-black italic text-accent leading-none tracking-tight transition-colors duration-500 group-hover:text-white">
            {name}
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl italic font-semibold text-brand-ink mt-0.5 transition-colors duration-500 group-hover:text-white">
            club
          </p>
        </div>
        
        <div className="flex gap-1.5 text-xs sm:text-sm italic font-bold text-muted-foreground items-center transition-colors duration-500 group-hover:text-white w-fit">
          <MoveUpRight className="w-3.5 h-3.5" />
          <span>click to join</span>
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-6 sm:-right-8 md:-right-12 w-37.5 h-37.5 sm:w-45 sm:h-45 md:w-55 md:h-55 z-10 drop-shadow-xl pointer-events-none transition-transform duration-500 ease-out group-hover:scale-110">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 150px, 220px"
          priority
        />
      </div>
    </Link>
  );
}