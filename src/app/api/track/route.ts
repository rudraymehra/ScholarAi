import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

function hashString(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint, userAgent } = body;

    if (!fingerprint || typeof fingerprint !== "string") {
      return NextResponse.json(
        { error: "Fingerprint is required" },
        { status: 400 }
      );
    }

    // Get IP address (for additional uniqueness, hashed for privacy)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash = hashString(ip);

    // Create or find existing visit
    const existingVisit = await prisma.visit.findUnique({
      where: { fingerprint },
    });

    let isNewUser = false;

    if (!existingVisit) {
      // New unique visitor
      await prisma.visit.create({
        data: {
          fingerprint,
          userAgent: userAgent?.slice(0, 500) || null,
          ipHash,
        },
      });

      // Update analytics counter
      await prisma.analytics.upsert({
        where: { id: "main" },
        update: {
          totalUsers: { increment: 1 },
        },
        create: {
          id: "main",
          totalUsers: 1,
          totalSearches: 0,
        },
      });

      isNewUser = true;
    }

    // Get current stats
    const analytics = await prisma.analytics.findUnique({
      where: { id: "main" },
    });

    return NextResponse.json({
      success: true,
      isNewUser,
      stats: {
        totalUsers: analytics?.totalUsers || 0,
        totalSearches: analytics?.totalSearches || 0,
      },
    });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
