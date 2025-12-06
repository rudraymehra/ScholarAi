"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Trash2, Copy, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesPanel({ isOpen, onClose }: NotesPanelProps) {
  const { savedNotes, deleteNote } = useAppStore();

  const copyNote = async (title: string, content: string) => {
    await navigator.clipboard.writeText(`${title}\n\n${content}`);
    toast.success("Note copied to clipboard!");
  };

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
                <div className="p-2.5 bg-[var(--accent)]/10 rounded-xl">
                  <Bookmark className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="font-serif font-semibold text-[var(--foreground)]">
                    Saved Notes
                  </h2>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {savedNotes.length} notes
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
              {savedNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="p-5 bg-[var(--background-secondary)] rounded-2xl mb-5">
                    <FileText className="w-10 h-10 text-[var(--foreground-muted)]" />
                  </div>
                  <h3 className="font-serif font-semibold text-[var(--foreground)] mb-2">
                    No saved notes
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] max-w-xs">
                    Save interesting findings by clicking the bookmark icon on
                    any answer
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {savedNotes.map((note, idx) => (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-[var(--foreground)] line-clamp-2 flex-1 pr-2">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyNote(note.title, note.content)}
                            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors"
                            title="Copy note"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteNote(note.id)}
                            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <p className="text-sm text-[var(--foreground-muted)] line-clamp-4 mb-4 leading-relaxed">
                        {note.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)] pt-3 border-t border-[var(--border)]">
                        <span>
                          {formatDistanceToNow(new Date(note.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {note.sources && note.sources.length > 0 && (
                          <span className="text-[var(--primary)]">
                            {note.sources.length} sources
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
