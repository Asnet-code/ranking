import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const runtime = "nodejs";

// POST /api/users/:userId/comments  body: { body: string }
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const { body } = await req.json();

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    if (!body || typeof body !== "string") {
      return NextResponse.json({ error: "body required" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!exists)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [comment] = await prisma.$transaction([
      prisma.comment.create({ data: { body, targetUserId: userId } }),
      prisma.user.update({
        where: { id: userId },
        data: { deathCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(comment, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "server error" },
      { status: 500 }
    );
  }
}
