"use client";

import { useEffect, useState } from "react";

function generateFingerprint(): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("ScholarAI", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("ScholarAI", 4, 17);
  }
  const canvasData = canvas.toDataURL();

  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    screen.width + "x" + screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency || "unknown",
    canvasData.slice(-50),
  ];

  // Simple hash function
  let hash = 0;
  const str = components.join("|");
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36) + Date.now().toString(36).slice(-4);
}

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    // Check if already tracked
    const storedFingerprint = localStorage.getItem("scholar_ai_fp");
    if (storedFingerprint) {
      setFingerprint(storedFingerprint);
      setIsTracked(true);
      return;
    }

    // Generate new fingerprint
    const fp = generateFingerprint();
    setFingerprint(fp);
    localStorage.setItem("scholar_ai_fp", fp);

    // Track the visit
    const trackVisit = async () => {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fingerprint: fp,
            userAgent: navigator.userAgent,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsTracked(true);
          if (data.isNewUser) {
            console.log("Welcome, new user!");
          }
        }
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();
  }, []);

  return { fingerprint, isTracked };
}
