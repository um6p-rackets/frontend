'use client';

import { VisitorNavbar } from '@/components/visitor-navbar';
import HeroSection from '@/components/home/hero-section';
import ClubList from '@/components/home/club-list';
import { Footer } from '@/components/footer';
import SectionHeader from '@/components/home/section-header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section >
        <VisitorNavbar />
        <HeroSection />
      </section>
      <section className="my-8 min-h-screen">
        <SectionHeader title="Our Clubs" id="clubs" />
        <ClubList />
      </section>
      <Footer />
    </div>
  );
}


