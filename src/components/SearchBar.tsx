"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Loader2, Sparkles, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Ask any research question...",
  suggestions = [],
  initialValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSearch(query.trim());
        setShowSuggestions(false);
      }
    },
    [query, isLoading, onSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      onSearch(suggestion);
      setShowSuggestions(false);
    },
    [onSearch]
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const exampleQueries = [
    "What are recent advances in CRISPR gene therapy?",
    "How does machine learning improve drug discovery?",
    "Explain the role of AI in climate research",
    "What causes Alzheimer's disease?",
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : exampleQueries;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 0 4px rgba(13, 92, 99, 0.12), 0 20px 50px rgba(0, 0, 0, 0.12)"
              : "0 4px 24px rgba(0, 0, 0, 0.06)",
          }}
          className="search-input-wrapper relative flex items-center overflow-hidden"
        >
          <div className="pl-5 text-[var(--foreground-muted)]">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding to allow clicks on suggestions
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-5 text-lg bg-transparent outline-none text-[var(--foreground)] placeholder-[var(--foreground-muted)] disabled:opacity-50"
          />

          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              type="button"
              onClick={clearQuery}
              className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!query.trim() || isLoading}
            className="m-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Search
          </motion.button>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 bg-[var(--surface)] rounded-xl shadow-xl border border-[var(--border)] overflow-hidden z-50"
            >
              <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Try asking
                </span>
              </div>
              <div className="p-2">
                {displaySuggestions.map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 text-[var(--foreground)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)] rounded-lg transition-all flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
                    <span className="line-clamp-1">{suggestion}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Keyboard hint */}
      <div className="mt-4 text-center flex items-center justify-center gap-2">
        <span className="text-sm text-[var(--foreground-muted)]">
          Press
        </span>
        <kbd className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--background-secondary)] rounded-md text-[var(--foreground-muted)] text-xs font-mono border border-[var(--border)]">
          <Command className="w-3 h-3" />
          K
        </kbd>
        <span className="text-sm text-[var(--foreground-muted)]">
          to search, or
        </span>
        <kbd className="px-2 py-1 bg-[var(--background-secondary)] rounded-md text-[var(--foreground-muted)] text-xs font-mono border border-[var(--border)]">
          Enter
        </kbd>
        <span className="text-sm text-[var(--foreground-muted)]">
          to submit
        </span>
      </div>
    </div>
  );
}
