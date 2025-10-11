import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Evita requisições excessivas ao Supabase
 * 
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debounce de objetos complexos
 * Útil para filtros e opções de busca
 * 
 * @param value - Objeto a ser debounced
 * @param delay - Delay em milissegundos (padrão: 300ms)
 * @returns Objeto debounced
 */
export const useDebounceObject = <T extends Record<string, any>>(
  value: T, 
  delay: number = 300
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [JSON.stringify(value), delay]); // Usar JSON.stringify para objetos

  return debouncedValue;
};
