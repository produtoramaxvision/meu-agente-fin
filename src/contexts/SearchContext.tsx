import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasResults: boolean;
  setHasResults: (hasResults: boolean) => void;
  searchResults: SearchResults;
  setSearchResults: (results: SearchResults) => void;
  clearSearch: () => void;
}

interface SearchResults {
  financial: any[];
  tasks: any[];
  agenda: any[];
  reports: any[];
  total: number;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasResults, setHasResults] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    financial: [],
    tasks: [],
    agenda: [],
    reports: [],
    total: 0
  });

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setHasResults(true);
    setSearchResults({
      financial: [],
      tasks: [],
      agenda: [],
      reports: [],
      total: 0
    });
  }, []);

  // ✅ OTIMIZAÇÃO: Memoizar value do context (padrão React.dev)
  const contextValue = useMemo(() => ({
    searchQuery, 
    setSearchQuery, 
    hasResults, 
    setHasResults, 
    searchResults, 
    setSearchResults,
    clearSearch
  }), [searchQuery, hasResults, searchResults, clearSearch]);

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}