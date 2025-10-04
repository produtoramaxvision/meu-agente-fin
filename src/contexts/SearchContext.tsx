import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasResults: boolean;
  setHasResults: (hasResults: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasResults, setHasResults] = useState(true);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, hasResults, setHasResults }}>
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