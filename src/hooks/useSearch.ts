// hooks/useSearch.ts
import { create } from 'zustand';

interface SearchStore {
  query: string;
  setQuery: (val: string) => void;
  clearQuery: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  setQuery: (val) => set({ query: val }),
  clearQuery: () => set({ query: '' }),
}));