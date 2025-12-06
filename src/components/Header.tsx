"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  History,
  Bookmark,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "./Providers";

interface HeaderProps {
  onToggleHistory?: () => void;
  onToggleNotes?: () => void;
  showHistory?: boolean;
  showNotes?: boolean;
}

export default function Header({
  onToggleHistory,
  onToggleNotes,
  showHistory,
  showNotes,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Use dark as default to match server render
  const currentTheme = mounted ? theme : "dark";

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="p-2.5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl shadow-lg shadow-[var(--primary)]/20"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-[var(--foreground)] tracking-tight">
                ScholarAI
              </span>
              <span className="text-[10px] text-[var(--foreground-muted)] -mt-1 tracking-widest uppercase">
                Research Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavButton
              icon={<History className="w-4 h-4" />}
              label="History"
              isActive={showHistory}
              onClick={onToggleHistory}
            />
            <NavButton
              icon={<Bookmark className="w-4 h-4" />}
              label="Notes"
              isActive={showNotes}
              onClick={onToggleNotes}
            />

            <div className="w-px h-6 bg-[var(--border)] mx-3" />

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
              title={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
            >
              <AnimatePresence mode="wait">
                {currentTheme === "light" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="w-px h-6 bg-[var(--border)] mx-2" />

            {/* Auth Button */}
            {status === "loading" ? (
              <div className="w-24 h-10 skeleton rounded-xl" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--background-secondary)] rounded-xl">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-6 h-6 rounded-full ring-2 ring-[var(--primary)]/20"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {session.user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="p-2.5 text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-dark)] transition-all shadow-lg shadow-[var(--primary)]/20"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] rounded-lg"
            >
              {currentTheme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--surface)] border-b border-[var(--border)]"
          >
            <div className="px-4 py-4 space-y-2">
              <MobileNavButton
                icon={<History className="w-5 h-5" />}
                label="Search History"
                onClick={() => {
                  onToggleHistory?.();
                  setIsMobileMenuOpen(false);
                }}
              />
              <MobileNavButton
                icon={<Bookmark className="w-5 h-5" />}
                label="Saved Notes"
                onClick={() => {
                  onToggleNotes?.();
                  setIsMobileMenuOpen(false);
                }}
              />

              <div className="pt-3 border-t border-[var(--border)]">
                {session ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt=""
                          className="w-10 h-10 rounded-full ring-2 ring-[var(--primary)]/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="font-medium text-[var(--foreground)]">
                        {session.user?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 text-[var(--error)] hover:bg-[var(--error)]/10 rounded-xl transition-colors text-sm font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
        isActive
          ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
          : "text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
      }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function MobileNavButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors"
    >
      <span className="text-[var(--primary)]">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
