import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const runtime = "nodejs";

// POST /api/users/:userId/comments   body: { body: string }
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const targetUserId = params.userId;
    const { body } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!body || typeof body !== "string") {
      return NextResponse.json({ error: "body required" }, { status: 400 });
    }

    // upewnij się, że użytkownik istnieje (opcjonalnie)
    const exists = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });
    if (!exists)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // transakcja: utwórz komentarz + podbij deathCount o 1
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: { body, targetUserId },
      }),
      prisma.user.update({
        where: { id: targetUserId },
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

// opcjonalny GET: lista komentarzy na profilu (najświeższe pierwsze)
export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const targetUserId = params.userId;
    const comments = await prisma.comment.findMany({
      where: { targetUserId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "server error" },
      { status: 500 }
    );
  }
}
