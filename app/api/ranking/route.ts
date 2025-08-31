import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const runtime = "nodejs";

// GET /api/ranking?limit=20
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 20);

  const users = await prisma.user.findMany({
    orderBy: [{ deathCount: "desc" }, { createdAt: "asc" }],
    take: Math.min(Math.max(limit, 1), 100),
    select: { id: true, name: true, image: true, deathCount: true, role: true },
  });

  return NextResponse.json(users);
}
