import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { Calendar } from '@/hooks/useAgendaData';

interface AgendaFiltersProps {
  calendars: Calendar[];
  selectedCalendars: string[];
  onCalendarsChange: (ids: string[]) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedPriorities: string[];
  onPrioritiesChange: (priorities: string[]) => void;
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onClearFilters: () => void;
}

const CATEGORIES = ['Trabalho', 'Pessoal', 'Reunião', 'Viagem', 'Foco', 'Outros'];
const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['confirmed', 'tentative', 'cancelled'];

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const STATUS_LABELS = {
  confirmed: 'Confirmado',
  tentative: 'Provisório',
  cancelled: 'Cancelado',
};

export function AgendaFilters({
  calendars,
  selectedCalendars,
  onCalendarsChange,
  selectedCategories,
  onCategoriesChange,
  selectedPriorities,
  onPrioritiesChange,
  selectedStatuses,
  onStatusesChange,
  searchQuery,
  onSearchQueryChange,
  onClearFilters,
}: AgendaFiltersProps) {
  const hasActiveFilters = 
    selectedCalendars.length > 0 ||
    selectedCategories.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedStatuses.length > 0 ||
    searchQuery.trim() !== '';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" />
          <h3 className="text-sm font-semibold">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          type="search"
          placeholder="Buscar eventos..."
          className="pl-9 bg-surface"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Agendas</label>
          <Select
            value={selectedCalendars.length === 1 ? selectedCalendars[0] : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                onCalendarsChange([]);
              } else {
                onCalendarsChange([value]);
              }
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as agendas</SelectItem>
              {calendars.map((cal) => (
                <SelectItem key={cal.id} value={cal.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: cal.color }}
                    />
                    {cal.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Categoria</label>
          <Select
            value={selectedCategories.length === 1 ? selectedCategories[0] : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                onCategoriesChange([]);
              } else {
                onCategoriesChange([value]);
              }
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Prioridade</label>
          <Select
            value={selectedPriorities.length === 1 ? selectedPriorities[0] : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                onPrioritiesChange([]);
              } else {
                onPrioritiesChange([value]);
              }
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-text-muted mb-1.5 block">Status</label>
          <Select
            value={selectedStatuses.length === 1 ? selectedStatuses[0] : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                onStatusesChange([]);
              } else {
                onStatusesChange([value]);
              }
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedCalendars.map((id) => {
            const cal = calendars.find((c) => c.id === id);
            return cal ? (
              <Badge key={id} variant="secondary" className="gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: cal.color }}
                />
                {cal.name}
                <button
                  onClick={() => onCalendarsChange(selectedCalendars.filter((cid) => cid !== id))}
                  className="ml-1 hover:bg-surface-hover rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {selectedCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <button
                onClick={() => onCategoriesChange(selectedCategories.filter((c) => c !== cat))}
                className="ml-1 hover:bg-surface-hover rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedPriorities.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
              <button
                onClick={() => onPrioritiesChange(selectedPriorities.filter((p) => p !== priority))}
                className="ml-1 hover:bg-surface-hover rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
              <button
                onClick={() => onStatusesChange(selectedStatuses.filter((s) => s !== status))}
                className="ml-1 hover:bg-surface-hover rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}