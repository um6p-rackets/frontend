import { cn } from 'cn';


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      this is register form
    </div>
  );
}
