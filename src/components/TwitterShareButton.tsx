"use client";

import { motion } from "framer-motion";
import { Twitter } from "lucide-react";

interface TwitterShareButtonProps {
  query: string;
  answer: string;
  className?: string;
  variant?: "icon" | "button";
}

export default function TwitterShareButton({
  query,
  answer,
  className = "",
  variant = "icon",
}: TwitterShareButtonProps) {
  const handleShare = () => {
    // Create a tweet-friendly summary
    const maxAnswerLength = 180;
    const truncatedAnswer =
      answer.length > maxAnswerLength
        ? answer.slice(0, maxAnswerLength).trim() + "..."
        : answer;

    const tweetText = `🔬 Research Q: "${query.slice(0, 80)}${query.length > 80 ? "..." : ""}"

📚 ${truncatedAnswer}

Powered by ScholarAI + Veritus Search API

#Research #AI #VeritusAI #AcademicTwitter`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;

    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  if (variant === "icon") {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleShare}
        className={`p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all ${className}`}
        title="Share on X (Twitter)"
      >
        <Twitter className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleShare}
      className={`flex items-center gap-2 px-5 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-all ${className}`}
    >
      <Twitter className="w-4 h-4" />
      Share on X
    </motion.button>
  );
}
