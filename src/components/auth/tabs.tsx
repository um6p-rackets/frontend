import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export function AuthTabs() {
  return (
    <Tabs
      defaultValue="register"
      className="w-100 sm:w-150 max-h-150 min-h-150 overflow-auto"
    >
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
