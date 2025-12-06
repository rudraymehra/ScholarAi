"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Target, Trophy } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalSearches: number;
  goal: number;
  progress: number;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSearches: 0,
    goal: 69,
    progress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="card p-6 animate-pulse">
          <div className="h-4 bg-[var(--background-secondary)] rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-[var(--background-secondary)] rounded-full mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-[var(--background-secondary)] rounded-xl"></div>
            <div className="h-16 bg-[var(--background-secondary)] rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(stats.progress, 100);
  const isGoalReached = progressPercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Progress Card */}
      <div className="card-elevated p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isGoalReached ? 'bg-[var(--success)]/10' : 'bg-[var(--primary)]/10'}`}>
              {isGoalReached ? (
                <Trophy className={`w-5 h-5 text-[var(--success)]`} />
              ) : (
                <Target className="w-5 h-5 text-[var(--primary)]" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-semibold text-[var(--foreground)]">
                User Goal Progress
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Help us reach our hackathon milestone
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${isGoalReached ? 'text-[var(--success)]' : 'text-[var(--primary)]'}`}>
              {stats.totalUsers}
            </span>
            <span className="text-[var(--foreground-muted)]"> / {stats.goal}</span>
            <p className="text-xs text-[var(--foreground-muted)]">users</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-[var(--background-secondary)] rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-y-0 left-0 rounded-full ${
              isGoalReached 
                ? 'bg-gradient-to-r from-[var(--success)] to-emerald-400' 
                : 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]'
            }`}
          />
          {/* Animated shine effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>

        {/* Progress percentage */}
        <p className="text-right text-sm text-[var(--foreground-muted)] mb-4">
          {progressPercentage.toFixed(0)}% complete
        </p>

        {isGoalReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 bg-[var(--success)]/10 rounded-xl border border-[var(--success)]/20"
          >
            <p className="text-center text-[var(--success)] font-semibold flex items-center justify-center gap-2">
              <span className="text-xl">🎉</span>
              Goal reached! Thank you to all our amazing users!
              <span className="text-xl">🎉</span>
            </p>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Unique Users"
            value={stats.totalUsers}
            color="primary"
          />
          <StatCard
            icon={<Search className="w-5 h-5" />}
            label="Total Searches"
            value={stats.totalSearches}
            color="accent"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "accent" | "success";
}) {
  const colorClasses = {
    primary: "text-[var(--primary)] bg-[var(--primary)]/10",
    accent: "text-[var(--accent)] bg-[var(--accent)]/10",
    success: "text-[var(--success)] bg-[var(--success)]/10",
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 p-4 bg-[var(--background-secondary)]/50 rounded-xl"
    >
      <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      <div>
        <motion.p
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-[var(--foreground)]"
        >
          {value.toLocaleString()}
        </motion.p>
        <p className="text-xs text-[var(--foreground-muted)] font-medium">{label}</p>
      </div>
    </motion.div>
  );
}
