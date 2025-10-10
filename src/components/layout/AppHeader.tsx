import { Search, AlertCircle, Menu, X } from 'lucide-react';
import { ThemeSwitch } from '@/components/ds/ThemeSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearch } from '@/contexts/SearchContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '../NotificationBell';

interface AppHeaderProps {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export function AppHeader({ onMenuClick, isMenuOpen = false }: AppHeaderProps) {
  const { cliente } = useAuth();
  const { searchQuery, setSearchQuery, hasResults } = useSearch();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sincroniza o input local com o estado global se ele mudar em outro lugar
    if (searchQuery !== localSearch) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Mostra erro visual quando não há resultados
    if (searchQuery && !hasResults) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [searchQuery, hasResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(timer);
    }
    
    setSearchQuery(localSearch);
    
    // Navega para a página de tarefas para exibir os resultados da busca
    if (location.pathname !== '/tarefas') {
      navigate('/tarefas');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-bg px-4 sm:px-6 lg:px-8 gap-4">
      
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md hover:bg-surface transition-colors group"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        <div className="relative w-5 h-5">
          <Menu 
            className={cn(
              "h-5 w-5 absolute inset-0 transition-all duration-300",
              isMenuOpen && "opacity-0 rotate-90 scale-0"
            )} 
          />
          <X 
            className={cn(
              "h-5 w-5 absolute inset-0 transition-all duration-300",
              !isMenuOpen && "opacity-0 rotate-90 scale-0"
            )} 
          />
        </div>
      </button>
      
      {/* Search */}
      <div className="flex-1 mr-2 sm:mr-6">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              type="search"
              placeholder="Buscar tarefas ou transações..."
              className={cn(
                "pl-9 pr-10 bg-surface transition-all duration-300",
                showError && "border-red-500/50 animate-shake"
              )}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {showError && (
              <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500 animate-pulse" />
            )}
          </div>
        </form>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <ThemeSwitch />
        <NotificationBell />
        
        {cliente && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{cliente.name}</p>
              <p className="text-xs text-text-muted">{cliente.phone}</p>
            </div>
            <Link to="/perfil" className="transition-transform duration-300 ease-in-out hover:scale-110 block">
              <Avatar>
                {cliente.avatar_url && (
                  <AvatarImage 
                    src={cliente.avatar_url}
                    alt={cliente.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
                  {getInitials(cliente.name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}