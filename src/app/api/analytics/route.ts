import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const analytics = await prisma.analytics.findUnique({
      where: { id: "main" },
    });

    const recentSearches = await prisma.search.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const totalVisits = await prisma.visit.count();

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: analytics?.totalUsers || 0,
        totalSearches: analytics?.totalSearches || 0,
        recentSearches,
        totalVisits,
        goal: 69,
        progress: Math.min(100, ((analytics?.totalUsers || 0) / 69) * 100),
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
