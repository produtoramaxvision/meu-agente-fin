import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, LogOut, Wallet, Target, AlertTriangle, Bell, CheckSquare, CalendarDays } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { QuickActions } from '@/components/QuickActions';
import { HelpAndSupport } from '@/components/HelpAndSupport';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda', href: '/agenda', icon: CalendarDays },
  { name: 'Contas', href: '/contas', icon: Wallet },
  { name: 'Metas', href: '/metas', icon: Target },
  { name: 'Tarefas', href: '/tarefas', icon: CheckSquare },
  { name: 'Alertas', href: '/alertas', icon: AlertTriangle },
  { name: 'Relatórios', href: '/relatorios', icon: FileText },
  { name: 'Notificações', href: '/notificacoes', icon: Bell },
  { name: 'Perfil', href: '/perfil', icon: User },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('a, button, input, [role="button"]');
        if (!isInteractive) {
          onToggle();
        }
      }}
      className={cn(
        'relative flex flex-col border-r transition-all duration-300 flex-shrink-0',
        'bg-[hsl(var(--sidebar-bg))] border-[hsl(var(--sidebar-border))]',
        collapsed ? 'w-16 cursor-pointer' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b border-[hsl(var(--sidebar-border))] transition-all",
        collapsed ? 'px-2 justify-center' : 'px-6'
      )}>
        <NavLink 
          to="/dashboard" 
          onClick={(e) => e.stopPropagation()}
          className="transition-transform hover:scale-105"
        >
          <Logo showText={!collapsed} size={collapsed ? 'sm' : 'md'} />
        </NavLink>
      </div>

      {/* Quick Actions */}
      <div className="border-b border-[hsl(var(--sidebar-border))] py-4">
        <QuickActions collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1 transition-all", collapsed ? 'p-2' : 'p-4')}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'group relative overflow-hidden flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] text-white shadow-lg'
                : 'text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg',
              collapsed && 'justify-center'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <item.icon className={cn('h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110', isActive && 'text-white')} />
            {!collapsed && <span className="relative z-10">{item.name}</span>}
          </NavLink>
          );
        })}
      </nav>

      {/* Help and Logout Section */}
      <div className="mt-auto">
        {/* Help */}
        <div className={cn("transition-all", collapsed ? 'p-2' : 'p-4')}>
          <HelpAndSupport collapsed={collapsed} mode="sidebar" />
        </div>

        {/* Logout */}
        <div className={cn("border-t border-[hsl(var(--sidebar-border))] transition-all", collapsed ? 'p-2' : 'p-4')}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className={cn(
              "group relative overflow-hidden flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              'text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg',
              collapsed && 'justify-center'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <LogOut className="h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110" />
            {!collapsed && <span className="relative z-10">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}