import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { AuthTabs } from './tabs';
import { useAuthPopupStore } from '@/store/auth_popup';

export function AuthButton({ title, className }: { title: string; className?: string }) {
  const isOpen = useAuthPopupStore((s) => s.isOpen);
  const { open, close } = useAuthPopupStore.getState();

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
      <AlertDialogTrigger
        render={
          <Button className={`  ${className}`}>
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
