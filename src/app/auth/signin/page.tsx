"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { BookOpen, Twitter, User, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [guestName, setGuestName] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGuestSignIn = async () => {
    setIsLoading("guest");
    await signIn("guest", {
      name: guestName || "Anonymous Researcher",
      callbackUrl: "/",
    });
  };

  const handleTwitterSignIn = async () => {
    setIsLoading("twitter");
    await signIn("twitter", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">ScholarAI</h1>
            </div>
            <p className="text-gray-600">
              Sign in to save your research and track your discoveries
            </p>
          </div>

          {/* Sign In Options */}
          <div className="space-y-4">
            {/* Twitter Login */}
            <button
              onClick={handleTwitterSignIn}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading === "twitter" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Twitter className="w-5 h-5" />
              )}
              Continue with X (Twitter)
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or</span>
              </div>
            </div>

            {/* Guest Login */}
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name (optional)"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleGuestSignIn}
                disabled={isLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading === "guest" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Continue as Guest
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-400">
            By signing in, you agree to help us reach 69 unique users for the
            hackathon challenge!
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="mb-2 font-medium">Why sign in?</p>
          <ul className="space-y-1 text-gray-400">
            <li>• Save your research notes</li>
            <li>• Track your search history</li>
            <li>• Help us reach our 69-user goal</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
