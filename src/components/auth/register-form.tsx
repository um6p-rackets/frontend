import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAuthPopupStore } from '@/store/auth_popup';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Fill in your details to register</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterFormFields />
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{' '}
        <a href="/terms">Terms of Service</a> and{' '}
        <a href="/privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

const schema = z.object({
  login: z.string().min(3, 'Login must be at least 3 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female'], { message: 'Select a gender' }),
  department: z.string().min(1, 'Department is required'),
  phone_number: z.string().regex(/^\+?[0-9]{8,15}$/, 'Invalid phone number'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
});
type FormData = z.infer<typeof schema>;

function RegisterFormFields() {
  const close = useAuthPopupStore((s) => s.close);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      gender: data.gender === 'male' // boolean for the API
    };

    try {
      // await registerUser(payload); // your API call
      console.log(payload);
      close();
    } catch {
      setError('root', { message: 'Registration failed, try again.' });
    }
  }

  const err = (msg?: string) =>
    msg && (
      <FieldDescription className="text-sm text-red-500">
        {msg}
      </FieldDescription>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="first_name">First name</FieldLabel>
            <Input
              id="first_name"
              placeholder="Zobair"
              {...register('first_name')}
            />
            {err(errors.first_name?.message)}
          </Field>
          <Field>
            <FieldLabel htmlFor="last_name">Last name</FieldLabel>
            <Input
              id="last_name"
              placeholder="Najdaoui"
              {...register('last_name')}
            />
            {err(errors.last_name?.message)}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="login">Login</FieldLabel>
          <Input id="login" placeholder="ilorez" {...register('login')} />
          {err(errors.login?.message)}
        </Field>

        <Field>
          <FieldLabel>Gender</FieldLabel>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="male" {...register('gender')} />
              Male
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="female" {...register('gender')} />
              Female
            </label>
          </div>
          {err(errors.gender?.message)}
        </Field>

        <Field>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Input
            id="department"
            placeholder="1337"
            {...register('department')}
          />
          {err(errors.department?.message)}
        </Field>

        <Field>
          <FieldLabel htmlFor="phone_number">Phone number</FieldLabel>
          <Input
            id="phone_number"
            type="tel"
            placeholder="+212600000000"
            {...register('phone_number')}
          />
          {err(errors.phone_number?.message)}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="zobair@example.com"
            {...register('email')}
          />
          {err(errors.email?.message)}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {err(errors.password?.message)}
        </Field>

        {err(errors.root?.message)}

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            Register
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
