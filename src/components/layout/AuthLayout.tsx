import { ReactNode } from 'react';
import { AppFooter } from './AppFooter';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-surface">
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}