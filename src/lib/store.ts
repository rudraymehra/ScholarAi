import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VeritusSearchResponse, VeritusSource } from "./veritus";

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  query?: string;
  sources?: VeritusSource[];
  createdAt: Date;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  answer: string;
  sources: VeritusSource[];
  timestamp: Date;
}

interface AppState {
  // Search state
  currentQuery: string;
  searchResult: VeritusSearchResponse | null;
  isSearching: boolean;
  searchError: string | null;

  // History
  searchHistory: SearchHistoryItem[];

  // Notes
  savedNotes: SavedNote[];

  // UI state
  showHistory: boolean;
  showNotes: boolean;

  // Actions
  setCurrentQuery: (query: string) => void;
  setSearchResult: (result: VeritusSearchResponse | null) => void;
  setIsSearching: (loading: boolean) => void;
  setSearchError: (error: string | null) => void;
  addToHistory: (item: Omit<SearchHistoryItem, "id" | "timestamp">) => void;
  clearHistory: () => void;
  saveNote: (note: Omit<SavedNote, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  toggleHistory: () => void;
  toggleNotes: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuery: "",
      searchResult: null,
      isSearching: false,
      searchError: null,
      searchHistory: [],
      savedNotes: [],
      showHistory: false,
      showNotes: false,

      // Actions
      setCurrentQuery: (query) => set({ currentQuery: query }),

      setSearchResult: (result) => set({ searchResult: result }),

      setIsSearching: (loading) => set({ isSearching: loading }),

      setSearchError: (error) => set({ searchError: error }),

      addToHistory: (item) =>
        set((state) => ({
          searchHistory: [
            {
              ...item,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
            ...state.searchHistory.slice(0, 49), // Keep last 50 searches
          ],
        })),

      clearHistory: () => set({ searchHistory: [] }),

      saveNote: (note) =>
        set((state) => ({
          savedNotes: [
            {
              ...note,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
            ...state.savedNotes,
          ],
        })),

      deleteNote: (id) =>
        set((state) => ({
          savedNotes: state.savedNotes.filter((n) => n.id !== id),
        })),

      toggleHistory: () => set((state) => ({ showHistory: !state.showHistory, showNotes: false })),

      toggleNotes: () => set((state) => ({ showNotes: !state.showNotes, showHistory: false })),

      reset: () =>
        set({
          currentQuery: "",
          searchResult: null,
          isSearching: false,
          searchError: null,
        }),
    }),
    {
      name: "scholar-ai-storage",
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        savedNotes: state.savedNotes,
      }),
    }
  )
);
