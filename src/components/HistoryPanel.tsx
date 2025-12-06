"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Search, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export default function HistoryPanel({
  isOpen,
  onClose,
  onSelectQuery,
}: HistoryPanelProps) {
  const { searchHistory, clearHistory } = useAppStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--surface)] shadow-2xl z-50 flex flex-col border-l border-[var(--border)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[var(--primary)]/10 rounded-xl">
                  <Clock className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="font-serif font-semibold text-[var(--foreground)]">
                    Search History
                  </h2>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {searchHistory.length} searches
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {searchHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="p-5 bg-[var(--background-secondary)] rounded-2xl mb-5">
                    <Search className="w-10 h-10 text-[var(--foreground-muted)]" />
                  </div>
                  <h3 className="font-serif font-semibold text-[var(--foreground)] mb-2">
                    No search history
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Your recent searches will appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {searchHistory.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: "var(--background-secondary)" }}
                      onClick={() => {
                        onSelectQuery(item.query);
                        onClose();
                      }}
                      className="w-full px-6 py-4 text-left transition-colors"
                    >
                      <p className="font-medium text-[var(--foreground)] line-clamp-2 mb-2">
                        {item.query}
                      </p>
                      <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-3">
                        {item.answer.slice(0, 120)}...
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(item.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="w-1 h-1 bg-[var(--foreground-muted)] rounded-full" />
                        <span className="text-[var(--primary)]">
                          {item.sources.length} sources
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {searchHistory.length > 0 && (
              <div className="px-6 py-4 border-t border-[var(--border)]">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={clearHistory}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
