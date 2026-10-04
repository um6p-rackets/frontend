'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { VisitorNavbar } from '@/components/visitor-navbar';
import HeroSection from '@/components/home/hero-section';
import ClubList from '@/components/home/club-list';
import { Footer } from '@/components/footer';
import SectionHeader from '@/components/home/section-header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section>
        <VisitorNavbar />
        <HeroSection />
      </section>
      <section className="my-8 ">
        <SectionHeader title="Our Clubs" />
        <ClubList />
      </section>
      <Footer />
    </div>
  );
}

// this is a simple example show how you can use:
// react-hook-form with zod for validation

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="space-y-3"
    >
      <Input placeholder="Email" {...register('email')} />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}
      <Input type="password" placeholder="Password" {...register('password')} />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}
      <Button type="submit">Login</Button>
    </form>
  );
}
