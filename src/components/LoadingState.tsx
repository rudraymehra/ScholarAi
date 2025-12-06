"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Database, Brain, FileSearch, GraduationCap } from "lucide-react";

const loadingSteps = [
  { icon: FileSearch, text: "Searching 200M+ academic papers..." },
  { icon: Database, text: "Analyzing relevant sources..." },
  { icon: Brain, text: "Synthesizing research insights..." },
  { icon: Sparkles, text: "Generating comprehensive answer..." },
];

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="card-elevated p-8">
        {/* Animated Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="p-5 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-light)] to-[var(--accent)] rounded-2xl shadow-xl animate-pulse-glow">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            {/* Orbiting particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 1,
                }}
                className="absolute inset-0"
                style={{ transformOrigin: "center center" }}
              >
                <div 
                  className="absolute w-2 h-2 bg-[var(--accent)] rounded-full shadow-lg"
                  style={{
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <h3 className="text-center font-serif text-xl font-semibold text-[var(--foreground)] mb-2">
          Researching your question
        </h3>
        <p className="text-center text-[var(--foreground-muted)] mb-8">
          This usually takes a few seconds
        </p>

        {/* Loading Steps */}
        <div className="space-y-3">
          {loadingSteps.map((step, index) => (
            <LoadingStep
              key={index}
              icon={step.icon}
              text={step.text}
              delay={index * 0.6}
              index={index}
            />
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-8">
          <div className="h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] rounded-full"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
        </div>

        <p className="text-center text-xs text-[var(--foreground-muted)] mt-6">
          Powered by <span className="text-[var(--primary)] font-medium">Veritus Search API</span>
        </p>
      </div>
    </motion.div>
  );
}

function LoadingStep({
  icon: Icon,
  text,
  delay,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  delay: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: [0.4, 1, 0.4],
        x: 0,
      }}
      transition={{
        opacity: {
          duration: 2.4,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        x: {
          duration: 0.4,
          delay: index * 0.1,
        }
      }}
      className="flex items-center gap-4 px-4 py-3.5 bg-[var(--background-secondary)]/50 rounded-xl border border-[var(--border)]"
    >
      <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
        <Icon className="w-4 h-4 text-[var(--primary)]" />
      </div>
      <span className="text-[var(--foreground)] font-medium">{text}</span>
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 1.5,
          delay: delay + 0.3,
          repeat: Infinity,
        }}
        className="ml-auto flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.15,
              repeat: Infinity,
            }}
            className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
