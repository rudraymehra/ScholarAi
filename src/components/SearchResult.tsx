"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Bookmark,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  FileText,
  Quote,
} from "lucide-react";
import type { VeritusSearchResponse, VeritusSource } from "@/lib/veritus";
import TwitterShareButton from "./TwitterShareButton";
import toast from "react-hot-toast";

interface SearchResultProps {
  query: string;
  result: VeritusSearchResponse;
  onFollowUp?: (question: string) => void;
  onSaveNote?: (title: string, content: string) => void;
}

export default function SearchResult({
  query,
  result,
  onFollowUp,
  onSaveNote,
}: SearchResultProps) {
  const [copied, setCopied] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());
  const [showAllSources, setShowAllSources] = useState(false);

  const copyToClipboard = async () => {
    const textToCopy = `Q: ${query}\n\nA: ${result.answer}\n\nSources:\n${result.sources
      .map((s, i) => `[${i + 1}] ${s.title}${s.url ? ` - ${s.url}` : ""}`)
      .join("\n")}`;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(query, result.answer);
      toast.success("Saved to notes!");
    }
  };

  const toggleSource = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  const displayedSources = showAllSources ? result.sources : result.sources.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Answer Card */}
      <div className="card-elevated overflow-hidden">
        {/* Header */}
        <div className="result-header px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-semibold text-lg">Research Answer</h2>
                <p className="text-sm text-white/70 mt-1 line-clamp-1 max-w-md">
                  {query}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyToClipboard}
                className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Copy answer"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </motion.button>
              {onSaveNote && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSaveNote}
                  className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  title="Save to notes"
                >
                  <Bookmark className="w-5 h-5" />
                </motion.button>
              )}
              <TwitterShareButton query={query} answer={result.answer} />
            </div>
          </div>
        </div>

        {/* Answer Content */}
        <div className="p-6 lg:p-8">
          <div className="prose max-w-none">
            <p className="text-[var(--foreground)] leading-[1.9] text-[17px] whitespace-pre-wrap">
              {result.answer}
            </p>
          </div>

          {/* Metadata */}
          {result.metadata && (
            <div className="mt-6 flex items-center gap-6 text-sm text-[var(--foreground-muted)] pt-4 border-t border-[var(--border)]">
              {result.metadata.totalResults && (
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--primary)]" />
                  <span className="font-medium">{result.metadata.totalResults.toLocaleString()}</span> papers analyzed
                </span>
              )}
              {result.metadata.searchTime && (
                <span className="flex items-center gap-2">
                  <span className="font-medium">{result.metadata.searchTime.toFixed(2)}s</span> search time
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sources Section */}
        <div className="border-t border-[var(--border)] px-6 lg:px-8 py-6 bg-[var(--background-secondary)]/30">
          <h3 className="font-serif font-semibold text-[var(--foreground)] mb-5 flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
              <BookOpen className="w-4 h-4 text-[var(--primary)]" />
            </div>
            Sources ({result.sources.length})
          </h3>

          <div className="space-y-3">
            {displayedSources.map((source, idx) => (
              <SourceCard
                key={idx}
                source={source}
                index={idx}
                isExpanded={expandedSources.has(idx)}
                onToggle={() => toggleSource(idx)}
              />
            ))}
          </div>

          {result.sources.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => setShowAllSources(!showAllSources)}
              className="mt-5 w-full py-3 text-[var(--primary)] hover:text-[var(--primary-light)] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--primary)]/5 rounded-xl transition-all"
            >
              {showAllSources ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {result.sources.length - 3} more sources
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Related Questions */}
        {result.relatedQuestions && result.relatedQuestions.length > 0 && (
          <div className="border-t border-[var(--border)] px-6 lg:px-8 py-6">
            <h3 className="font-serif font-semibold text-[var(--foreground)] mb-4 flex items-center gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              </div>
              Related Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.relatedQuestions.map((question, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onFollowUp?.(question)}
                  className="question-pill text-sm"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SourceCard({
  source,
  index,
  isExpanded,
  onToggle,
}: {
  source: VeritusSource;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className="source-card overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-start gap-4 text-left hover:bg-[var(--primary)]/3 transition-colors"
      >
        <span className="flex-shrink-0 w-7 h-7 bg-[var(--primary)] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[var(--foreground)] line-clamp-2 leading-snug">
            {source.title}
          </h4>
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--foreground-muted)]">
            {source.authors && source.authors.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {source.authors.slice(0, 2).join(", ")}
                {source.authors.length > 2 && ` +${source.authors.length - 2}`}
              </span>
            )}
            {source.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {source.year}
              </span>
            )}
            {source.journal && (
              <span className="text-[var(--primary)] font-medium truncate max-w-[180px]">
                {source.journal}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
        </motion.div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-4"
        >
          {source.abstract && (
            <p className="text-sm text-[var(--foreground-muted)] mb-4 pl-11 leading-relaxed">
              {source.abstract}
            </p>
          )}
          <div className="flex items-center gap-4 pl-11">
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-light)] font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View paper
              </a>
            )}
            {source.doi && (
              <span className="text-sm text-[var(--foreground-muted)]">
                DOI: <span className="font-mono text-xs">{source.doi}</span>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
