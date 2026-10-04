import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { AuthTabs } from './tabs';
import { useAuthPopupStore } from '@/store/auth_popup';

export function AuthButton({ title }: { title: string }) {
  const isOpen = useAuthPopupStore((s) => s.isOpen);
  const { open, close } = useAuthPopupStore.getState();

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
      <AlertDialogTrigger
        render={
          <Button className="mt-8 h-14.25 w-fit rounded-md bg-primary px-10 text-xl font-normal text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-primary/80">
            {title}
          </Button>
        }
      />
      <AlertDialogContent className="w-fit h-fit max-w-fit" size="lg">
        <AuthTabs />
      </AlertDialogContent>
    </AlertDialog>
  );
}
