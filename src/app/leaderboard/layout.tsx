import { Footer } from '@/components/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="pt-20">
      <div className="min-h-screen p-4 lg:p-6 xl:p-8">{children}</div>
      <Footer />
    </div>
  );
}
