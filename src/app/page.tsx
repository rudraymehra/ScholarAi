"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  FileText,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Brain,
  GraduationCap,
  Library,
} from "lucide-react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import LoadingState from "@/components/LoadingState";
import StatsCounter from "@/components/StatsCounter";
import HistoryPanel from "@/components/HistoryPanel";
import NotesPanel from "@/components/NotesPanel";
import PDFUpload from "@/components/PDFUpload";
import { useAppStore } from "@/lib/store";
import { useFingerprint } from "@/hooks/useFingerprint";
import type { VeritusSearchResponse } from "@/lib/veritus";
import toast from "react-hot-toast";

export default function Home() {
  const [showPDFUpload, setShowPDFUpload] = useState(false);
  const {
    searchResult,
    isSearching,
    searchError,
    showHistory,
    showNotes,
    setSearchResult,
    setIsSearching,
    setSearchError,
    addToHistory,
    saveNote,
    toggleHistory,
    toggleNotes,
  } = useAppStore();

  const [currentQuery, setCurrentQuery] = useState("");

  // Track user visit
  useFingerprint();

  const handleSearch = useCallback(
    async (query: string) => {
      setCurrentQuery(query);
      setIsSearching(true);
      setSearchError(null);
      setSearchResult(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Search failed");
        }

        const data = await response.json();
        const result: VeritusSearchResponse = data.data;

        setSearchResult(result);
        addToHistory({
          query,
          answer: result.answer,
          sources: result.sources,
        });
      } catch (error) {
        console.error("Search error:", error);
        setSearchError(
          error instanceof Error ? error.message : "An error occurred"
        );
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [setIsSearching, setSearchError, setSearchResult, addToHistory]
  );

  const handleSaveNote = useCallback(
    (title: string, content: string) => {
      saveNote({
        title,
        content,
        query: currentQuery,
        sources: searchResult?.sources,
      });
    },
    [saveNote, currentQuery, searchResult]
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="orb-1 top-[-150px] left-[5%] animate-float" />
        <div className="orb-2 top-[30%] right-[0%] animate-float" style={{ animationDelay: "2s" }} />
        <div className="orb-3 bottom-[5%] left-[15%] animate-float" style={{ animationDelay: "4s" }} />
        <div className="bg-dots-pattern absolute inset-0 opacity-40" />
      </div>

      <Header
        onToggleHistory={toggleHistory}
        onToggleNotes={toggleNotes}
        showHistory={showHistory}
        showNotes={showNotes}
      />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-flex items-center gap-5 mb-8"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="p-5 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-light)] to-[var(--accent)] rounded-2xl shadow-2xl animate-pulse-glow"
                >
                  <GraduationCap className="w-12 h-12 text-white" />
                </motion.div>
                <div className="text-left">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
                    <span className="gradient-text-animated">ScholarAI</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[var(--foreground-muted)] tracking-[0.2em] uppercase mt-1">
                    AI-Powered Research
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xl sm:text-2xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed"
              >
                Ask any question and get{" "}
                <span className="font-semibold text-[var(--foreground)]">instant, cited answers</span>{" "}
                from{" "}
                <span className="font-serif italic text-[var(--primary)]">
                  200M+ academic papers
                </span>
              </motion.p>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-3 mt-8"
              >
                {[
                  { icon: Brain, text: "AI-Powered" },
                  { icon: Shield, text: "Peer-Reviewed" },
                  { icon: Zap, text: "Instant Results" },
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="badge badge-primary flex items-center gap-2"
                  >
                    <badge.icon className="w-4 h-4" />
                    <span>{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <SearchBar
                onSearch={handleSearch}
                isLoading={isSearching}
                suggestions={searchResult?.relatedQuestions}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPDFUpload(!showPDFUpload)}
                className="group flex items-center gap-2 px-5 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--foreground-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm"
              >
                <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Upload PDF
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSearch("What are the latest breakthroughs in AI?")}
                className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Try an Example
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <LoadingState key="loading" />
            ) : searchError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto card-elevated p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--error)]/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-[var(--foreground)] mb-2">
                  Something went wrong
                </h3>
                <p className="text-[var(--error)] mb-6">{searchError}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => currentQuery && handleSearch(currentQuery)}
                  className="px-6 py-3 bg-[var(--error)] text-white font-semibold rounded-xl hover:bg-[var(--error)]/90 transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : searchResult ? (
              <SearchResult
                key="result"
                query={currentQuery}
                result={searchResult}
                onFollowUp={handleSearch}
                onSaveNote={handleSaveNote}
              />
            ) : showPDFUpload ? (
              <PDFUpload key="pdf" onClose={() => setShowPDFUpload(false)} />
            ) : (
              <motion.div
                key="features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-20"
              >
                {/* Stats Counter */}
                <StatsCounter />

                {/* Features Grid */}
                <div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mb-10"
                  >
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3">
                      <span className="gradient-text">Why Researchers Love Us</span>
                    </h2>
                    <p className="text-[var(--foreground-muted)]">
                      Trusted by students, academics, and professionals worldwide
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                      icon={<Zap className="w-7 h-7" />}
                      title="Instant Answers"
                      description="Get comprehensive answers synthesized from the latest research papers in seconds, not hours."
                      color="primary"
                      delay={0.1}
                    />
                    <FeatureCard
                      icon={<Shield className="w-7 h-7" />}
                      title="Verified Sources"
                      description="Every answer comes with citations to peer-reviewed academic papers you can trust."
                      color="accent"
                      delay={0.2}
                    />
                    <FeatureCard
                      icon={<Library className="w-7 h-7" />}
                      title="200M+ Papers"
                      description="Access the world's largest academic database powered by Veritus AI technology."
                      color="secondary"
                      delay={0.3}
                    />
                  </div>
                </div>

                {/* Example Queries */}
                <div className="text-center">
                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)] mb-2">
                    Popular Research Questions
                  </h3>
                  <p className="text-[var(--foreground-muted)] mb-8">
                    Click any question to explore
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {[
                      { q: "How does CRISPR gene editing work?", icon: "🧬" },
                      { q: "What causes climate change?", icon: "🌍" },
                      { q: "Latest advances in quantum computing", icon: "⚛️" },
                      { q: "How does immunotherapy fight cancer?", icon: "💉" },
                    ].map((item, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSearch(item.q)}
                        className="question-pill flex items-center gap-3"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.q}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* How It Works */}
                <div className="py-8">
                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)] text-center mb-10">
                    How It Works
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                      { step: "1", title: "Ask", desc: "Type any research question in natural language", icon: "💬" },
                      { step: "2", title: "Analyze", desc: "AI searches 200M+ papers to find relevant information", icon: "🔍" },
                      { step: "3", title: "Answer", desc: "Get a comprehensive answer with verified citations", icon: "✨" },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 * idx }}
                        className="text-center group"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          className="w-20 h-20 mx-auto mb-5 bg-[var(--background-secondary)] rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:shadow-lg transition-shadow"
                        >
                          {item.icon}
                        </motion.div>
                        <div className="inline-block px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-bold mb-3 tracking-wider">
                          STEP {item.step}
                        </div>
                        <h4 className="text-lg font-serif font-semibold text-[var(--foreground)] mb-2">
                          {item.title}
                        </h4>
                        <p className="text-[var(--foreground-muted)] text-sm">
                          {item.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--surface)]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
              <div className="p-2 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-semibold text-[var(--foreground)]">ScholarAI</span>
              <span className="text-sm">
                Powered by{" "}
                <a
                  href="https://veritus.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors"
                >
                  Veritus Search API
                </a>
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
              <span className="badge badge-accent">
                🏆 Veritus AI Hackathon 2024
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Side Panels */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={toggleHistory}
        onSelectQuery={handleSearch}
      />
      <NotesPanel isOpen={showNotes} onClose={toggleNotes} />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "accent" | "secondary";
  delay?: number;
}) {
  const colorClasses = {
    primary: {
      icon: "from-[var(--primary)] to-[var(--primary-dark)]",
      bg: "bg-[var(--primary)]/5",
    },
    accent: {
      icon: "from-[var(--accent)] to-[var(--accent-light)]",
      bg: "bg-[var(--accent)]/5",
    },
    secondary: {
      icon: "from-[var(--secondary)] to-[var(--secondary-light)]",
      bg: "bg-[var(--secondary)]/10",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className={`feature-card ${colorClasses[color].bg}`}
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color].icon} flex items-center justify-center mb-5 shadow-lg`}>
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="text-xl font-serif font-bold text-[var(--foreground)] mb-3">{title}</h3>
      <p className="text-[var(--foreground-muted)] leading-relaxed">{description}</p>
    </motion.div>
  );
}
