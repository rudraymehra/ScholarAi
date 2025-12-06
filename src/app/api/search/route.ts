import { NextRequest, NextResponse } from "next/server";
import { veritus } from "@/lib/veritus";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userId } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    if (query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return NextResponse.json(
        { error: "Query must be less than 1000 characters" },
        { status: 400 }
      );
    }

    // Call Veritus API with optional synthesis
    const result = await veritus.searchWithSynthesis(query.trim());

    // Save search to database (for analytics)
    try {
      await prisma.search.create({
        data: {
          query: query.trim(),
          answer: result.answer,
          sources: JSON.stringify(result.sources),
          userId: userId || null,
        },
      });

      // Update analytics
      await prisma.analytics.upsert({
        where: { id: "main" },
        update: {
          totalSearches: { increment: 1 },
        },
        create: {
          id: "main",
          totalSearches: 1,
          totalUsers: 0,
        },
      });
    } catch (dbError) {
      console.error("Database error (non-critical):", dbError);
      // Don't fail the request if DB save fails
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process search request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  // Redirect to POST handler logic
  try {
    const result = await veritus.searchWithSynthesis(query.trim());

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process search request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
