import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Register } from '../auth/register';

export default function HeroSection() {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-white font-[family-name:var(--font-poppins)] dark:bg-[#121417]'
      )}
    >
      {/* decorative bars (desktop only) */}
      <span
        aria-hidden
        className="absolute bottom-[75px] left-[460px] hidden h-2.5 w-[335px] bg-[#2B2F33] dark:bg-white lg:block"
      />
      <span
        aria-hidden
        className="absolute right-0 top-[372px] hidden h-2.5 w-[29%] bg-[#2B2F33] dark:bg-white lg:block"
      />

      {/* tennis ball */}
      <Image
        src="/tenis_ball.png"
        alt=""
        width={135}
        height={135}
        priority
        className="pointer-events-none absolute right-4 top-4 z-20 w-[48px] sm:w-[110px] lg:right-[100px] lg:top-[72px] lg:w-[135px]"
      />

      <div className="relative mx-auto grid max-w-[1440px] items-start gap-10 px-5 pb-10 pt-20 sm:py-10 lg:grid-cols-[535px_1fr] lg:gap-[70px] lg:px-0 lg:py-0 lg:pl-[22px]">
        {/* court + rackets image (hidden on phones) */}
        <Image
          src="/hero_decoration_1.png"
          alt="Tennis and badminton rackets on a court"
          width={535}
          height={628}
          priority
          className="relative z-10 mx-auto hidden h-auto w-full max-w-[535px] sm:block lg:mx-0"
        />

        {/* content */}
        <div className="relative z-10 flex flex-col lg:pt-[150px]">
          <h1 className="text-5xl font-bold leading-none tracking-tight text-[#2B2F33] dark:text-white sm:text-7xl lg:text-[90px]">
            <span className="text-[#D94A28]">UM6P</span> Racket
          </h1>

          <p className="mt-8 text-lg text-[#2B2F33] dark:text-white sm:text-[22px]">
            All Rackets Sport In One Place
          </p>

          <Register title="Get Started" />

          <p className="mt-12 max-w-[545px] font-[family-name:var(--font-roboto-condensed)] text-lg font-light leading-snug text-[#2B2F33] dark:text-gray-300 lg:ml-[230px] lg:mt-14">
            Welcome to the UM6P racket sports hub—a platform designed to make
            organizing your matches completely effortless so you can simply
            focus on enjoying your sport more.
          </p>
        </div>
      </div>
    </section>
  );
}