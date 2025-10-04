import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-bg">
      <div className="flex flex-1">
        <AppSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}