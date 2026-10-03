"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ThemeToggle } from "@/components/theme-toggle";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold">
        Theme Test
      </h1>

      <p className="text-muted-foreground">
        click to check
      </p>

      <ThemeToggle />
      <LoginForm />
    </main>
  );
}

// this is a simple example show how you can use:
// react-hook-form with zod for validation

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-3">
      <Input placeholder="Email" {...register("email")} />
      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      <Input type="password" placeholder="Password" {...register("password")} />
      {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      <Button type="submit">Login</Button>
    </form>
  );
}