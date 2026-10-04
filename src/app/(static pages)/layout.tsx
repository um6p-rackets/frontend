import { Footer } from '@/components/footer';
import { StaticNavbar } from '@/components/static-navbar';

export default function StaticLayout({ children }: LayoutProps<'/'>) {
  return (
    <div>
      <StaticNavbar />
      {children}
      <Footer />
    </div>
  );
}
