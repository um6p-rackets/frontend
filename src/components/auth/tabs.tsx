import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { useAuthPopupStore } from '@/store/auth_popup';

export function AuthTabs() {
  const { close } = useAuthPopupStore.getState();
  return (
    <Tabs
      defaultValue="register"
      className="relative w-100 sm:w-150 max-h-150 min-h-150 overflow-auto pt-10"
    >
      <X
        className="absolute top-2 left-2 cursor-pointer"
        onClick={() => {
          close();
        }}
      />
      <TabsList className="grid w-full grid-cols-2 rounded-none shadow-none bg-none bg-muted/50">
        <TabsTrigger value="login" className="rounded-none shadow-none bg-none">
          Login
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="rounded-none shadow-none bg-none"
        >
          Register
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}
