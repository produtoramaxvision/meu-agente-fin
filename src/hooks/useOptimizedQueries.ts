/**
 * Optimized Query Hooks
 * Hooks otimizados para queries com paginação e cache
 * 
 * Funcionalidades:
 * - Paginação automática
 * - Cache inteligente
 * - Retry automático
 * - Performance monitoring
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryPerformance } from '@/lib/performance-monitor';

// Configurações de paginação
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutos
};

// Hook para dados paginados
export const usePaginatedData = <T>(
  queryFn: (offset: number, limit: number) => Promise<T[]>,
  pageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
  options: {
    enabled?: boolean;
    staleTime?: number;
    retry?: number;
  } = {}
) => {
  const { measureQuery } = useQueryPerformance();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const { enabled = true, staleTime = PAGINATION_CONFIG.CACHE_TIME, retry = 3 } = options;

  // Verificar se dados estão stale
  const isStale = useMemo(() => {
    return Date.now() - lastFetch > staleTime;
  }, [lastFetch, staleTime]);

  const loadMore = useCallback(async () => {
    if (!enabled || loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await measureQuery(
        `paginated-query-${queryFn.name}`,
        () => queryFn(data.length, pageSize)
      );

      setData(prev => [...prev, ...result]);
      setHasMore(result.length === pageSize);
      setLastFetch(Date.now());
    } catch (err) {
      setError(err as Error);
      console.error('Error loading more data:', err);
    } finally {
      setLoading(false);
    }
  }, [data.length, loading, hasMore, queryFn, pageSize, enabled, measureQuery]);

  const refresh = useCallback(async () => {
    setData([]);
    setHasMore(true);
    setLastFetch(0);
    await loadMore();
  }, [loadMore]);

  // Carregar dados iniciais
  useEffect(() => {
    if (enabled && data.length === 0) {
      loadMore();
    }
  }, [enabled, data.length, loadMore]);

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    isStale,
    totalLoaded: data.length,
  };
};

// Hook para queries com cache inteligente
export const useCachedQuery = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    staleTime?: number;
    retry?: number;
    refetchOnWindowFocus?: boolean;
  } = {}
) => {
  const { measureQuery } = useQueryPerformance();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const {
    enabled = true,
    staleTime = PAGINATION_CONFIG.CACHE_TIME,
    retry = 3,
    refetchOnWindowFocus = true,
  } = options;

  const isStale = useMemo(() => {
    return Date.now() - lastFetch > staleTime;
  }, [lastFetch, staleTime]);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled || (loading && !force)) return;

    // Usar cache se dados não estão stale
    if (!force && data && !isStale) {
      return data;
    }

    setLoading(true);
    setError(null);

    let attempts = 0;
    while (attempts < retry) {
      try {
        const result = await measureQuery(
          `cached-query-${queryKey}`,
          queryFn
        );

        setData(result);
        setLastFetch(Date.now());
        return result;
      } catch (err) {
        attempts++;
        if (attempts >= retry) {
          setError(err as Error);
          console.error(`Error fetching ${queryKey}:`, err);
          throw err;
        }
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  }, [enabled, loading, data, isStale, queryKey, queryFn, retry, measureQuery]);

  // Refetch quando janela ganha foco
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (isStale) {
        fetchData(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, isStale, fetchData]);

  // Carregar dados iniciais
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    isStale,
  };
};

// Hook para queries com debounce
export const useDebouncedQuery = <T>(
  queryFn: (value: string) => Promise<T>,
  delay: number = 300,
  options: {
    enabled?: boolean;
    minLength?: number;
  } = {}
) => {
  const { measureQuery } = useQueryPerformance();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<string>('');

  const { enabled = true, minLength = 2 } = options;

  // Debounce do valor
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(debouncedValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [debouncedValue, delay]);

  // Executar query quando valor debounced mudar
  useEffect(() => {
    if (!enabled || debouncedValue.length < minLength) {
      setData(null);
      return;
    }

    const executeQuery = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await measureQuery(
          `debounced-query-${debouncedValue}`,
          () => queryFn(debouncedValue)
        );
        setData(result);
      } catch (err) {
        setError(err as Error);
        console.error('Debounced query error:', err);
      } finally {
        setLoading(false);
      }
    };

    executeQuery();
  }, [debouncedValue, enabled, minLength, queryFn, measureQuery]);

  const setValue = useCallback((value: string) => {
    setDebouncedValue(value);
  }, []);

  return {
    data,
    loading,
    error,
    setValue,
    value: debouncedValue,
  };
};

// Hook para queries com retry automático
export const useRetryQuery = <T>(
  queryFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    retryCount?: number;
    retryDelay?: number;
    retryCondition?: (error: Error) => boolean;
  } = {}
) => {
  const { measureQuery } = useQueryPerformance();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    enabled = true,
    retryCount: maxRetries = 3,
    retryDelay = 1000,
    retryCondition = () => true,
  } = options;

  const executeQuery = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    let attempts = 0;
    while (attempts <= maxRetries) {
      try {
        const result = await measureQuery(
          `retry-query-attempt-${attempts}`,
          queryFn
        );

        setData(result);
        setRetryCount(0);
        return result;
      } catch (err) {
        attempts++;
        setRetryCount(attempts);

        if (attempts > maxRetries || !retryCondition(err as Error)) {
          setError(err as Error);
          console.error(`Query failed after ${attempts} attempts:`, err);
          break;
        }

        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
      }
    }
  }, [enabled, maxRetries, retryDelay, retryCondition, queryFn, measureQuery]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  return {
    data,
    loading,
    error,
    retryCount,
    retry: executeQuery,
  };
};
