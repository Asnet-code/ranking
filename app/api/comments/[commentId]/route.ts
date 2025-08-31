import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const runtime = "nodejs";

// DELETE /api/comments/:commentId
export async function DELETE(
  _req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;

    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, targetUserId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.comment.delete({ where: { id: commentId } }),
      prisma.user.update({
        where: { id: existing.targetUserId },
        data: { deathCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "server error" },
      { status: 500 }
    );
  }
}
