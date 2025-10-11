import React, { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAgendaData } from '@/hooks/useAgendaData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

/**
 * Exemplo de componente otimizado usando debounce
 * Demonstra como evitar requisições excessivas ao Supabase
 */
export const SearchableAgenda = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✅ OTIMIZAÇÃO: Debounce da busca para evitar requisições excessivas
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms de delay
  
  // ✅ OTIMIZAÇÃO: Usar React Query com cache inteligente
  const { events, isLoading } = useAgendaData({
    view: 'agenda',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    searchQuery: debouncedSearchQuery, // Usar query debounced
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando eventos...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              {debouncedSearchQuery ? 'Nenhum evento encontrado' : 'Nenhum evento agendado'}
            </p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(event.start_ts).toLocaleDateString('pt-BR')}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Debug info - remover em produção */}
      {import.meta.env.DEV && (
        <div className="text-xs text-gray-400 border-t pt-2">
          <p>Query original: "{searchQuery}"</p>
          <p>Query debounced: "{debouncedSearchQuery}"</p>
          <p>Eventos encontrados: {events.length}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Exemplo de componente com filtros múltiplos usando debounce
 */
export const FilterableFinancialData = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all' as 'entrada' | 'saida' | 'all',
    status: 'all' as 'pago' | 'pendente' | 'all',
    periodDays: 30,
  });
  
  // ✅ OTIMIZAÇÃO: Debounce dos filtros para evitar requisições excessivas
  const debouncedFilters = useDebounce(filters, 300);
  
  // ✅ OTIMIZAÇÃO: Usar React Query com cache inteligente
  const { records, loading, metrics } = useFinancialData(
    debouncedFilters.periodDays,
    debouncedFilters.category,
    debouncedFilters.type,
    debouncedFilters.status
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="all">Todas as categorias</option>
          <option value="alimentacao">Alimentação</option>
          <option value="transporte">Transporte</option>
          <option value="lazer">Lazer</option>
        </select>
        
        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
          className="p-2 border rounded"
        >
          <option value="all">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
          className="p-2 border rounded"
        >
          <option value="all">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>
        
        <select
          value={filters.periodDays}
          onChange={(e) => setFilters(prev => ({ ...prev, periodDays: Number(e.target.value) }))}
          className="p-2 border rounded"
        >
          <option value={7}>Últimos 7 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={90}>Últimos 90 dias</option>
        </select>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Receitas</p>
              <p className="text-2xl font-bold text-green-700">
                R$ {metrics.totalReceitas.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Despesas</p>
              <p className="text-2xl font-bold text-red-700">
                R$ {metrics.totalDespesas.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Saldo</p>
              <p className="text-2xl font-bold text-blue-700">
                R$ {metrics.saldo.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Transações</p>
              <p className="text-2xl font-bold text-gray-700">
                {metrics.totalTransacoes}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {records.map((record) => (
              <div key={record.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{record.categoria}</h3>
                    <p className="text-sm text-gray-600">{record.descricao}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.data_hora).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${record.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.tipo === 'entrada' ? '+' : '-'} R$ {record.valor.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{record.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Debug info - remover em produção */}
      {import.meta.env.DEV && (
        <div className="text-xs text-gray-400 border-t pt-2">
          <p>Filtros originais: {JSON.stringify(filters)}</p>
          <p>Filtros debounced: {JSON.stringify(debouncedFilters)}</p>
          <p>Registros encontrados: {records.length}</p>
        </div>
      )}
    </div>
  );
};
